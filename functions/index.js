/* ───────────────────────────────────────────────────────────────
   Desert Shop — Cloud Functions
   createYalidineParcel: called from the admin panel when an order is
   confirmed. Reads the order from Firestore, calls the Yalidine API to
   create a parcel (bordereau), and writes the tracking number back.

   Credentials are entered in the admin Settings page and stored in the
   server-only Firestore doc `private/yalidine` ({ apiId, apiToken }), which
   clients cannot read (see firestore.rules). The Admin SDK below bypasses
   those rules. Origin wilaya is read from the `originWilaya` field of the
   single site_settings document (also set in the admin Settings page).
   ─────────────────────────────────────────────────────────────── */
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

admin.initializeApp();

const API_BASE = 'https://api.yalidine.app/v1';

exports.createYalidineParcel = onCall(
  { region: 'us-central1' },
  async (req) => {
    const orderId = req.data && req.data.orderId;
    if (!orderId) throw new HttpsError('invalid-argument', 'orderId is required');

    const db = admin.firestore();
    const ref = db.collection('orders').doc(String(orderId));
    const snap = await ref.get();
    if (!snap.exists) throw new HttpsError('not-found', 'Order not found');
    const o = snap.data();

    // Already created? return existing tracking (idempotent).
    if (o.yalidine && o.yalidine.tracking) {
      return { alreadyCreated: true, tracking: o.yalidine.tracking, label: o.yalidine.label || null };
    }

    // Origin wilaya from settings.
    const setSnap = await db.collection('site_settings').limit(1).get();
    const settings = setSnap.empty ? {} : setSnap.docs[0].data();
    const fromWilaya = String(settings.originWilaya || '').trim();
    if (!fromWilaya) {
      throw new HttpsError('failed-precondition', 'حدّدي ولاية الإرسال (originWilaya) في إعدادات لوحة التحكم أولاً.');
    }

    // Yalidine API credentials from the server-only private doc.
    const credSnap = await db.collection('private').doc('yalidine').get();
    const cred = credSnap.exists ? credSnap.data() : {};
    const apiId = String(cred.apiId || '').trim();
    const apiToken = String(cred.apiToken || '').trim();
    if (!apiId || !apiToken) {
      throw new HttpsError('failed-precondition', 'أدخلي API ID و API Token الخاصين بـ Yalidine في إعدادات لوحة التحكم أولاً.');
    }

    const headers = {
      'X-API-ID': apiId,
      'X-API-TOKEN': apiToken,
      'Content-Type': 'application/json',
    };

    // Stopdesk: pick a Yalidine center in the destination wilaya. The center's
    // commune (not the customer's) must be used as to_commune_name, otherwise
    // Yalidine rejects with "stopdesk_id does not belong to to_commune_name".
    const isStopdesk = (o.deliveryType === 'office' || o.deliveryType === 'desk');
    let stopdeskCenter = null;
    if (isStopdesk && o.wilayaId) {
      try {
        const cRes = await fetch(`${API_BASE}/centers/?wilaya_id=${encodeURIComponent(o.wilayaId)}`, { headers });
        if (cRes.ok) {
          const cj = await cRes.json();
          const centers = (cj && cj.data) || [];
          if (centers.length) {
            const wanted = String(o.communeFr || o.baladiya || '').toLowerCase().trim();
            stopdeskCenter = centers.find(function (c) { return String(c.commune_name || '').toLowerCase().trim() === wanted; }) || centers[0];
          }
        }
      } catch (e) { /* fall back to home delivery below */ }
    }

    // Split full name into first / family.
    const fullName = String(o.customer || '').trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    const firstname = parts.shift() || fullName || '—';
    const familyname = parts.join(' ') || firstname;

    const productList = (o.deliveryLabel && String(o.deliveryLabel).trim())
      ? String(o.deliveryLabel).trim().slice(0, 250)
      : ((o.items || []).map((it) => `${it.title} x${it.qty || 1}`).join(', ') || 'منتجات').slice(0, 250);
    const codPrice = Number(o.parcelPrice != null ? o.parcelPrice : (o.total != null ? o.total : o.subtotal)) || 0;
    const useStopdesk = isStopdesk && !!stopdeskCenter;

    const parcel = {
      order_id: String(o.num || orderId),
      from_wilaya_name: fromWilaya,
      firstname,
      familyname,
      contact_phone: String(o.phone || '').replace(/\s/g, ''),
      address: [String(o.address || '').trim(), `${o.baladiya || ''} - ${o.wilaya || ''}`.trim()].filter(Boolean).join(' - '),
      to_commune_name: useStopdesk ? stopdeskCenter.commune_name : (o.communeFr || o.baladiya || ''),
      to_wilaya_name: useStopdesk ? (stopdeskCenter.wilaya_name || o.wilayaFr || o.wilaya) : (o.wilayaFr || o.wilaya || ''),
      product_list: productList,
      price: codPrice,
      do_insurance: o.insurance === true,
      declared_value: codPrice,
      length: 0, width: 0, height: 0, weight: 1,
      freeshipping: false,
      is_stopdesk: useStopdesk,
      stopdesk_id: useStopdesk ? stopdeskCenter.center_id : null,
      has_exchange: false,
      product_to_collect: null,
    };

    let res, text;
    try {
      res = await fetch(`${API_BASE}/parcels/`, { method: 'POST', headers, body: JSON.stringify([parcel]) });
      text = await res.text();
    } catch (e) {
      throw new HttpsError('unavailable', 'تعذّر الاتصال بـ Yalidine: ' + e.message);
    }
    let body; try { body = JSON.parse(text); } catch (e) { body = text; }
    if (!res.ok) {
      throw new HttpsError('internal', 'Yalidine API error (' + res.status + '): ' + (typeof body === 'string' ? body : JSON.stringify(body)));
    }

    // Response is keyed by order_id: { "<order_id>": { success, tracking, label, ... } }
    let entry = null;
    if (body && typeof body === 'object') entry = body[Object.keys(body)[0]];
    if (!entry || entry.success === false) {
      throw new HttpsError('internal', 'رفضت Yalidine الطرد: ' + JSON.stringify(entry || body));
    }

    const tracking = entry.tracking || null;
    const labelUrl = entry.label || entry.labels || null;

    await ref.update({
      yalidine: { tracking, label: labelUrl, stopdesk: useStopdesk, createdAt: Date.now() },
      status: 'Confirmed',
      fulfilled: true,
    });

    return { ok: true, tracking, label: labelUrl };
  }
);

/* ───────────────────────────────────────────────────────────────
   createNoestParcel: same flow for Noest (app.noest-dz.com).
   Credentials live in private/noest ({ apiToken, userGuid }). Noest's
   account already knows the origin, so no origin wilaya is needed.
   The order is created and then validated so it reaches logistics.
   ─────────────────────────────────────────────────────────────── */
const NOEST_BASE = 'https://app.noest-dz.com';

exports.createNoestParcel = onCall(
  { region: 'us-central1' },
  async (req) => {
    const orderId = req.data && req.data.orderId;
    if (!orderId) throw new HttpsError('invalid-argument', 'orderId is required');

    const db = admin.firestore();
    const ref = db.collection('orders').doc(String(orderId));
    const snap = await ref.get();
    if (!snap.exists) throw new HttpsError('not-found', 'Order not found');
    const o = snap.data();

    if (o.noest && o.noest.tracking) {
      return { alreadyCreated: true, tracking: o.noest.tracking };
    }
    if (!o.wilayaId) {
      throw new HttpsError('failed-precondition', 'الطلب لا يحتوي على رقم ولاية صالح.');
    }

    const credSnap = await db.collection('private').doc('noest').get();
    const cred = credSnap.exists ? credSnap.data() : {};
    const token = String(cred.apiToken || '').trim();
    const guid = String(cred.userGuid || '').trim();
    if (!token || !guid) {
      throw new HttpsError('failed-precondition', 'أدخلي API Token و user_guid الخاصين بـ Noest في إعدادات لوحة التحكم أولاً.');
    }

    const headers = { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', Accept: 'application/json' };

    // Stopdesk needs a station code in the destination wilaya. Prefer a desk
    // in the customer's commune; fall back to the wilaya's first desk.
    const isStopdesk = (o.deliveryType === 'office' || o.deliveryType === 'desk');
    let stationCode = null;
    if (isStopdesk) {
      try {
        const dRes = await fetch(NOEST_BASE + '/api/public/desks', { headers });
        if (dRes.ok) {
          const desks = await dRes.json();
          const norm = (s) => String(s || '').toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9؀-ۿ]+/g, ' ').trim();
          const wantCommune = norm(o.communeFr || o.baladiya);
          let first = null;
          for (const k in desks) {
            const d = desks[k] || {};
            const code = String(d.code || '');
            const m = code.match(/^(\d+)/);
            if (!m || parseInt(m[1], 10) !== Number(o.wilayaId)) continue;
            if (!first) first = code;
            if (wantCommune) {
              const hay = norm([d.commune, d.commune_name, d.name, d.station_name, d.address, d.adresse]
                .filter(Boolean).join(' '));
              if (hay && (hay.includes(wantCommune) || wantCommune.includes(hay))) { stationCode = code; break; }
            }
          }
          if (!stationCode) stationCode = first;
        }
      } catch (e) { /* fall back to home delivery */ }
    }
    const useStopdesk = isStopdesk && !!stationCode;

    const productList = (o.deliveryLabel && String(o.deliveryLabel).trim())
      ? String(o.deliveryLabel).trim().slice(0, 250)
      : ((o.items || []).map((it) => `${it.title} x${it.qty || 1}`).join(', ') || 'منتجات').slice(0, 250);
    const montant = Number(o.parcelPrice != null ? o.parcelPrice : (o.total != null ? o.total : o.subtotal)) || 0;

    const payload = {
      user_guid: guid,
      reference: String(o.num || ('DS-' + orderId)),
      client: (String(o.customer || '').trim() || '—').slice(0, 255),
      phone: String(o.phone || '').replace(/\s/g, ''),
      adresse: [String(o.address || '').trim(), `${o.baladiya || ''} - ${o.wilaya || ''}`.trim()].filter(Boolean).join(' - ').slice(0, 255) || String(o.wilaya || '—'),
      wilaya_id: Number(o.wilayaId),
      commune: o.communeFr || o.baladiya || '',
      montant: montant,
      produit: productList,
      type_id: 1,
      poids: 1,
      stop_desk: useStopdesk ? 1 : 0,
    };
    if (useStopdesk) payload.station_code = stationCode;

    let res, text;
    try {
      res = await fetch(NOEST_BASE + '/api/public/create/order', { method: 'POST', headers, body: JSON.stringify(payload) });
      text = await res.text();
    } catch (e) {
      throw new HttpsError('unavailable', 'تعذّر الاتصال بـ Noest: ' + e.message);
    }
    let body; try { body = JSON.parse(text); } catch (e) { body = text; }
    if (!res.ok || !body || body.success !== true || !body.tracking) {
      throw new HttpsError('internal', 'فشل إنشاء طلب Noest: ' + (typeof body === 'string' ? body : JSON.stringify(body)));
    }
    const tracking = body.tracking;

    // Do NOT auto-validate. Validating locks the order and moves it into Noest's
    // "en traitement". Leaving it unvalidated keeps it in "prêt à expédier" so the
    // seller can review and validate/ship it from Noest when ready.
    await ref.update({
      noest: { tracking, validated: false, stopdesk: useStopdesk, createdAt: Date.now() },
      status: 'Confirmed',
      fulfilled: true,
    });

    return { ok: true, tracking, validated: false };
  }
);

/* ───────────────────────────────────────────────────────────────
   createZrParcel: same flow for ZR Express (api.zrexpress.app — their
   current tenant-based platform, generated via the portal's "API Rest
   → Token API"). Credentials live in private/zrexpress ({ tenantId,
   secretKey }), sent as the X-Tenant / X-Api-Key headers. Unlike
   Yalidine/Noest, ZR Express addresses need territory UUIDs instead of
   plain wilaya/commune names, so the destination is looked up live
   against ZR Express's own territory list right before creating the
   parcel — the same idea as the Yalidine center / Noest desk lookups
   above, just against a different API.
   ─────────────────────────────────────────────────────────────── */
const ZR_BASE = 'https://api.zrexpress.app/api/v1';

// 0XXXXXXXXX → +213XXXXXXXXX (ZR Express wants international format).
function zrPhone(p) {
  let d = String(p || '').replace(/[^\d]/g, '');
  if (d.startsWith('213')) return '+' + d;
  if (d.startsWith('0')) d = d.slice(1);
  return '+213' + d;
}

// A throwaway-but-valid UUID v4 (ZR Express requires a customerId even without a stored customer).
function zrUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0; const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

// Parse a ZR error body into a readable message (error.detail / error.errors[] / title / raw).
function zrErrMsg(body, status) {
  if (!body) return 'HTTP ' + status;
  if (typeof body === 'string') return body || ('HTTP ' + status);
  if (body.detail) return String(body.detail);
  if (body.errors) {
    if (Array.isArray(body.errors)) return body.errors.map((e) => (e && (e.message || e.description)) || JSON.stringify(e)).join('; ');
    try { return Object.values(body.errors).reduce((a, b) => a.concat(b), []).join('; '); } catch (e) { /* fall through */ }
    return JSON.stringify(body.errors);
  }
  return String(body.title || ('HTTP ' + status));
}

// fetch + parse JSON-or-text in one go.
async function zrFetch(url, opts) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let body; try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }
  return { res, body };
}

async function zrCreds(db) {
  const credSnap = await db.collection('private').doc('zrexpress').get();
  const cred = credSnap.exists ? credSnap.data() : {};
  const tenantId = String(cred.tenantId || '').trim();
  const secretKey = String(cred.secretKey || '').trim();
  if (!tenantId || !secretKey) {
    throw new HttpsError('failed-precondition', 'أدخلي Tenant ID و Secret Key الخاصين بـ ZR Express في إعدادات لوحة التحكم أولاً.');
  }
  return { tenantId, secretKey };
}
function zrHeaders(c) { return { 'X-Tenant': c.tenantId, 'X-Api-Key': c.secretKey, 'Content-Type': 'application/json' }; }

// ZR Express caps pageSize at 1000, but the territory table (58 wilayas + ~1,540
// communes) has more rows than that — fetch every page rather than one oversized
// request, which the API rejects outright.
async function zrAllTerritories(headers) {
  const rows = [];
  for (let pageNumber = 1; ; pageNumber++) {
    const { res, body } = await zrFetch(ZR_BASE + '/territories/search', {
      method: 'POST', headers,
      body: JSON.stringify({ pageNumber, pageSize: 1000, orderBy: ['code asc'] }),
    });
    if (!res.ok) throw new HttpsError('unavailable', 'تعذّر جلب قائمة ولايات ZR Express: ' + zrErrMsg(body, res.status));
    const page = (body && (body.items || body.data || body.results)) || [];
    rows.push(...page);
    if (!body || !body.hasNext || page.length === 0) break;
  }
  return rows;
}

// Destination wilaya/commune territory UUIDs, resolved live from ZR Express's own
// territory list (mirrors the Yalidine-center / Noest-desk lookups above).
async function zrResolveTerritory(headers, wilayaCode, communeName) {
  const rows = await zrAllTerritories(headers);
  const wRow = rows.find((t) => t.level === 'wilaya' && Number(t.code) === Number(wilayaCode));
  if (!wRow) throw new HttpsError('failed-precondition', 'ولاية الزبون غير مدعومة لدى ZR Express — حدّثي قوائم التوصيل.');

  const norm = (s) => String(s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9؀-ۿ]+/g, ' ').trim();
  const wanted = norm(communeName);
  const communeRows = rows.filter((t) => t.level === 'commune' && t.parentId === wRow.id);
  const cRow = communeRows.find((t) => norm(t.name) === wanted) ||
    communeRows.find((t) => wanted && (norm(t.name).includes(wanted) || wanted.includes(norm(t.name)))) ||
    communeRows[0];
  if (!cRow) throw new HttpsError('failed-precondition', 'لم يُعثر على بلدية مطابقة لدى ZR Express.');

  const hasPickup = communeRows.some((t) => t.delivery && t.delivery.hasPickupPoint);
  return { cityTerritoryId: wRow.id, districtTerritoryId: cRow.id, hasPickup };
}

// Pickup-point (stopdesk) parcels need a hubId in the destination wilaya; falls back to
// home delivery if none is found (same fallback style as the Yalidine/Noest lookups).
async function zrFindHub(headers, cityTerritoryId) {
  try {
    const { res, body } = await zrFetch(ZR_BASE + '/hubs/search', {
      method: 'POST', headers, body: JSON.stringify({ pageNumber: 1, pageSize: 1000 }),
    });
    if (!res.ok) return null;
    const hubs = (body && (body.items || body.data || body.results)) || [];
    const hit = hubs.find((h) => h && h.isPickupPoint && h.address && String(h.address.cityTerritoryId) === String(cityTerritoryId));
    return hit ? hit.id : null;
  } catch (e) { return null; }
}

exports.createZrParcel = onCall(
  { region: 'us-central1' },
  async (req) => {
    const orderId = req.data && req.data.orderId;
    if (!orderId) throw new HttpsError('invalid-argument', 'orderId is required');

    const db = admin.firestore();
    const ref = db.collection('orders').doc(String(orderId));
    const snap = await ref.get();
    if (!snap.exists) throw new HttpsError('not-found', 'Order not found');
    const o = snap.data();

    if (o.zr && o.zr.tracking) {
      return { alreadyCreated: true, tracking: o.zr.tracking };
    }
    if (!o.wilayaId) throw new HttpsError('failed-precondition', 'الطلب لا يحتوي على رقم ولاية صالح.');

    const cred = await zrCreds(db);
    const headers = zrHeaders(cred);

    const isStopdesk = (o.deliveryType === 'office' || o.deliveryType === 'desk');
    const territory = await zrResolveTerritory(headers, o.wilayaId, o.communeFr || o.baladiya);

    let deliveryType = 'home', hubId = null;
    if (isStopdesk && territory.hasPickup) {
      hubId = await zrFindHub(headers, territory.cityTerritoryId);
      if (hubId) deliveryType = 'pickup-point';
    }
    const useStopdesk = deliveryType === 'pickup-point';

    const productList = (o.deliveryLabel && String(o.deliveryLabel).trim())
      ? String(o.deliveryLabel).trim().slice(0, 250)
      : ((o.items || []).map((it) => `${it.title} x${it.qty || 1}`).join(', ') || 'منتجات').slice(0, 250);
    const amount = Math.max(0, Math.min(150000, Math.round(Number(o.parcelPrice != null ? o.parcelPrice : (o.total != null ? o.total : o.subtotal)) || 0)));

    const payload = {
      customer: {
        customerId: zrUuid(),
        name: (String(o.customer || '').trim() || 'Client').slice(0, 100),
        phone: { number1: zrPhone(o.phone) },
      },
      deliveryAddress: {
        cityTerritoryId: territory.cityTerritoryId,
        districtTerritoryId: territory.districtTerritoryId,
        street: String(o.address || '').slice(0, 200),
      },
      orderedProducts: [{
        productName: productList, unitPrice: amount, quantity: 1, stockType: 'none',
        length: 20, width: 10, height: 1, weight: 1,
      }],
      amount,
      description: productList,
      deliveryType,
      externalId: String(o.num || orderId).slice(0, 100),
    };
    if (useStopdesk && hubId) payload.hubId = hubId;

    const { res, body } = await zrFetch(ZR_BASE + '/parcels', { method: 'POST', headers, body: JSON.stringify(payload) });
    if (!(res.status === 201 || res.ok) || !body || !body.id) {
      throw new HttpsError('internal', 'رفضت ZR Express الطرد: ' + zrErrMsg(body, res.status));
    }
    const parcelId = body.id;

    // The create response only returns the parcel id; fetch the tracking number
    // by that id. If this fails, refreshing status later (fetchZrStatus) also
    // looks up by parcelId and heals o.zr.tracking once it succeeds.
    let tracking = null;
    try {
      const { res: pRes, body: pBody } = await zrFetch(ZR_BASE + '/parcels/' + parcelId, { method: 'GET', headers });
      if (pRes.ok) tracking = pBody.trackingNumber || null;
    } catch (e) { /* tracking fills in on the next status refresh */ }

    await ref.update({
      zr: { tracking: tracking || parcelId, parcelId, stopdesk: useStopdesk, createdAt: Date.now() },
      status: 'Confirmed',
      fulfilled: true,
    });

    return { ok: true, tracking: tracking || parcelId };
  }
);

/* ───────────────────────────────────────────────────────────────
   getParcelStatus: called from the admin panel's "🔄 تحديث" button on
   a confirmed order. Fetches the LIVE status from whichever carrier
   shipped the order (o.noest.tracking or o.yalidine.tracking),
   normalizes the raw carrier status into a small 5-stage pipeline
   (or an "alert" state for failed/suspended/returned parcels), caches
   the result on the order (trackingStatus) so the admin panel can
   render it without hitting the carrier API on every page load, and
   returns it. Refreshing is manual (button click) to respect each
   carrier's rate limits — status is not polled automatically.
   ─────────────────────────────────────────────────────────────── */
const STAGE_LABELS = ['تم إنشاء الطلب', 'تم التأكيد والشحن', 'في مركز الفرز', 'خرج للتوصيل', 'تم التسليم'];

// Noest's status keys are a small fixed set, so an exact-match table is safe.
const NOEST_STAGE = {
  upload: 0, edited_informations: 0, customer_validation: 0,
  validation_collect_colis: 1, validation_reception_admin: 1, validation_reception: 1,
  sent_to_redispatch: 2, fdr_activated: 3, mise_a_jour: 3,
  livre: 4, livred: 4,
};
const NOEST_ALERT = {
  colis_suspendu: 'معلّق ⚠️',
  nouvel_tentative_asked_by_customer: 'بانتظار محاولة توصيل جديدة',
  return_asked_by_customer: 'مرتجع (بطلب من الزبون)',
  return_asked_by_hub: 'مرتجع (بطلب من المركز)',
  retour_dispatched_to_partenaires: 'قيد الإرجاع',
  return_dispatched_to_partenaire: 'قيد الإرجاع',
  colis_retour_transmit_to_partner: 'قيد الإرجاع',
  livraison_echoue_recu: 'فشل التسليم',
  return_validated_by_partener: 'تم تأكيد الإرجاع',
  return_redispatched_to_livraison: 'إعادة محاولة التوصيل',
  return_dispatched_to_warehouse: 'أُعيد إلى المخزن',
  pickedup: 'استُلم (إرجاع)',
  valid_return_pickup: 'تم تأكيد استلام الإرجاع',
  pickup_picked_recu: 'تم استلام الإرجاع',
};

// Yalidine's status is free-text French, so match by keyword instead of an exact table.
function yalidineNormalize(raw) {
  const s = String(raw || '');
  // Pre-shipping states first — "Pas encore expédié" / "Prêt à expédier"
  // contain "expédi" and "Pas encore ramassé" contains "ramass", so testing
  // the shipped keywords first would wrongly show them as already shipped.
  if (/(pas encore|pr[êe]t [àa] exp[ée]dier|en pr[ée]paration|v[ée]rifier)/i.test(s)) return { stage: 0, alert: null };
  if (/^Livr[ée]/i.test(s)) return { stage: 4, alert: null };
  if (/(retour|[ée]change)/i.test(s)) return { stage: null, alert: 'مرتجع / قيد الإرجاع' };
  // Failures: "Tentative échouée", "En alerte", "Echèc livraison" (è!), "échoué".
  if (/(tentative|alerte|[ée]ch[eè]c|[ée]chou)/i.test(s)) return { stage: 3, alert: 'مشكلة في التوصيل — تحتاج متابعة' };
  if (/(sorti|attente|pr[êe]t pour livreur)/i.test(s)) return { stage: 3, alert: null };
  if (/(centre|wilaya|localisation)/i.test(s)) return { stage: 2, alert: null };
  if (/(ramass|bloqu|transfert|exp[ée]di)/i.test(s)) return { stage: 1, alert: null };
  return { stage: 0, alert: null };
}

async function fetchNoestStatus(db, o) {
  const credSnap = await db.collection('private').doc('noest').get();
  const cred = credSnap.exists ? credSnap.data() : {};
  const token = String(cred.apiToken || '').trim();
  const guid = String(cred.userGuid || '').trim();
  if (!token) throw new HttpsError('failed-precondition', 'أدخلي بيانات Noest أولاً.');
  const headers = { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', Accept: 'application/json' };

  let res, body;
  try {
    // Noest's API doc marks api_token AND user_guid as required body fields for
    // get/trackings/info. Without user_guid the lookup isn't scoped to the
    // account and Noest answers "Trackings non trouvés" for parcels that exist.
    res = await fetch(NOEST_BASE + '/api/public/get/trackings/info', {
      method: 'POST', headers,
      body: JSON.stringify({ api_token: token, user_guid: guid, trackings: [o.noest.tracking] }),
    });
    body = await res.json();
  } catch (e) {
    throw new HttpsError('unavailable', 'تعذّر الاتصال بـ Noest: ' + e.message);
  }
  // Noest returns this (not an HTTP error) for parcels still sitting unvalidated
  // in "prêt à expédier" — very common right after creation, not a real failure.
  if (body && body.message === 'Trackings non trouvés') {
    return {
      carrier: 'noest', tracking: o.noest.tracking,
      stage: 0, alert: null, stageLabels: STAGE_LABELS,
      lastLabel: 'بانتظار تأكيد الطلب في Noest', lastLocation: null, lastDate: null,
      events: [], updatedAt: Date.now(),
    };
  }
  if (!res.ok) throw new HttpsError('internal', 'Noest tracking error: ' + JSON.stringify(body));

  const entry = (body && typeof body === 'object')
    ? (body[o.noest.tracking] || body[Object.keys(body)[0]]) : null;
  // Noest's activity events carry no geographic location field — "by" is the
  // partner/shop name (e.g. the account owner), not a place, so it must not
  // be used as one.
  const rawEvents = (entry && (entry.activity || entry.events)) || [];
  const events = rawEvents.map((e) => ({
    key: e.event_key || e.key || e.status || '',
    label: e.event || e.event_key || e.key || e.status || '',
    date: e.date || e.created_at || e.updated_at || null,
    location: e.location || null,
  })).filter((e) => e.date).sort((a, b) => new Date(a.date) - new Date(b.date));

  const last = events[events.length - 1] || null;
  const alert = last ? (NOEST_ALERT[last.key] || null) : null;

  // Stage = the highest recognized milestone reached across the WHOLE history,
  // not just the last event. Looking only at the last event meant an
  // intermediate event_key we don't have mapped (e.g. a hub scan) would reset
  // the tracker back to "just created" even after real progress happened.
  let stage = 0;
  events.forEach((e) => { if (e.key in NOEST_STAGE) stage = Math.max(stage, NOEST_STAGE[e.key]); });
  // Validated in Noest = any activity beyond the initial upload/edit. Used to
  // sync o.noest.validated so the panel stops asking to confirm a parcel the
  // seller already confirmed in the Noest dashboard.
  const noestValidated = events.some((e) =>
    e.key === 'customer_validation' || (NOEST_STAGE[e.key] || 0) >= 1 || (e.key in NOEST_ALERT));
  // Our stage table only covers the event_keys we've seen so far. Log every key
  // we don't recognize (not just when none match) so gaps in the table — which
  // is why some orders show a stuck/blank tracker while others progress fine —
  // are visible in the Cloud Functions logs.
  events.forEach((e) => {
    if (!(e.key in NOEST_STAGE) && !(e.key in NOEST_ALERT)) {
      console.log('[getParcelStatus] unrecognized Noest event_key', e.key, e.label, 'tracking:', o.noest.tracking);
    }
  });
  // An event_key we've never mapped means Noest did something beyond the
  // known pre-shipping steps — show at least stage 1 instead of sticking at
  // "just created". Only unmapped keys count: upload/edit/validation events
  // are mapped to 0 on purpose and must NOT bump a fresh parcel to "shipped".
  const hasUnmapped = events.some((e) => !(e.key in NOEST_STAGE) && !(e.key in NOEST_ALERT));
  if (!alert && hasUnmapped && stage === 0) stage = 1;
  // "Colis en transit" means Noest handed the parcel to transport, but it can
  // arrive under an event_key mapped to a pre-shipping stage, which left
  // "تم إنشاء الطلب" unchecked. Any "en transit" label = creation done → stage ≥ 1.
  if (!alert && stage === 0 && events.some((e) => /en\s*transit/i.test(e.label))) stage = 1;
  if (alert) stage = null;

  return {
    carrier: 'noest', tracking: o.noest.tracking,
    stage, alert, stageLabels: STAGE_LABELS,
    // Show Noest's OWN status text (e.g. "Validé", "Tentative de livraison"),
    // never our stage guess — the stage table is incomplete and replacing the
    // real label with STAGE_LABELS[stage] hid what Noest actually said.
    lastLabel: last ? (alert || last.label || STAGE_LABELS[stage]) : 'بانتظار المعالجة',
    lastLocation: last ? last.location : null,
    lastDate: last ? last.date : null,
    noestValidated,
    events, updatedAt: Date.now(),
  };
}

async function fetchYalidineStatus(db, o) {
  const credSnap = await db.collection('private').doc('yalidine').get();
  const cred = credSnap.exists ? credSnap.data() : {};
  const apiId = String(cred.apiId || '').trim(), apiToken = String(cred.apiToken || '').trim();
  if (!apiId || !apiToken) throw new HttpsError('failed-precondition', 'أدخلي بيانات Yalidine أولاً.');
  const headers = { 'X-API-ID': apiId, 'X-API-TOKEN': apiToken };

  let res, body;
  try {
    res = await fetch(`${API_BASE}/parcels/?tracking=${encodeURIComponent(o.yalidine.tracking)}`, { headers });
    body = await res.json();
  } catch (e) {
    throw new HttpsError('unavailable', 'تعذّر الاتصال بـ Yalidine: ' + e.message);
  }
  if (!res.ok) throw new HttpsError('internal', 'Yalidine tracking error: ' + JSON.stringify(body));
  // Only accept the parcel whose tracking actually matches — if the filter
  // were ever ignored, data[0] would be some other parcel's state.
  const list = (body && Array.isArray(body.data)) ? body.data : [];
  const parcel = list.find((p) => p && p.tracking === o.yalidine.tracking)
    || (body && !body.data && body.tracking === o.yalidine.tracking ? body : null);
  // No parcel record yet (just created, not picked up by Yalidine's system) — same
  // "still pending" case as Noest's unvalidated parcels, not a real failure.
  if (!parcel) {
    return {
      carrier: 'yalidine', tracking: o.yalidine.tracking,
      stage: 0, alert: null, stageLabels: STAGE_LABELS,
      lastLabel: 'بانتظار معالجة الطلب لدى Yalidine', lastLocation: null, lastDate: null,
      events: [], updatedAt: Date.now(),
    };
  }

  const rawStatus = parcel.last_status || '';
  const { stage, alert } = yalidineNormalize(rawStatus);
  const location = [parcel.current_commune_name, parcel.current_wilaya_name].filter(Boolean).join(' - ');

  let events = [];
  try {
    const hRes = await fetch(`${API_BASE}/histories/${encodeURIComponent(o.yalidine.tracking)}`, { headers });
    if (hRes.ok) {
      const hBody = await hRes.json();
      const list = Array.isArray(hBody) ? hBody : (hBody && hBody.data) || [];
      events = list.map((h) => ({
        key: h.status, label: h.status, date: h.date_status,
        location: [h.commune_name, h.wilaya_name].filter(Boolean).join(' - '),
      })).sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  } catch (e) { /* history is best-effort; the parcel's own last_status already covers the stepper */ }

  return {
    carrier: 'yalidine', tracking: o.yalidine.tracking,
    stage, alert, stageLabels: STAGE_LABELS,
    lastLabel: alert || rawStatus || 'بانتظار المعالجة',
    lastLocation: location || null,
    lastDate: parcel.date_last_status || null,
    events, updatedAt: Date.now(),
  };
}

// ZR Express's status is a free-text state name (English, e.g. "OutForDelivery" with
// no spaces), so match by keyword like Yalidine's. "Out for delivery" must be checked
// before the "delivered" test — it contains "delivery", which "delivered" would
// otherwise substring-match and misreport as fully delivered.
function zrNormalize(raw) {
  const s = String(raw || '').toLowerCase();
  if (/out\s*for\s*delivery|en cours de livraison|dispatch/.test(s)) return { stage: 3, alert: null };
  if (/^(delivered|livr[ée])/.test(s)) return { stage: 4, alert: null };
  if (/(return|retour|cancel|annul)/.test(s)) return { stage: null, alert: 'مرتجع / ملغى — تحتاج متابعة' };
  if (/(fail|[ée]chec|problem|probl[èe]me|hold|suspend)/.test(s)) return { stage: 3, alert: 'مشكلة في التوصيل — تحتاج متابعة' };
  if (/(hub|center|centre|sort|tri|transit)/.test(s)) return { stage: 2, alert: null };
  // "Prêt à expédier" = parcel registered and ready for pickup. Count order
  // creation as done (stage 1) so the "تم إنشاء الطلب" step is checked off.
  if (/(pick|ramass|creat|confirm)/.test(s) || /pr[êe]t\s*[àa]\s*exp[ée]dier|ready\s*to\s*ship/.test(s)) return { stage: 1, alert: null };
  return { stage: 0, alert: null };
}

async function fetchZrStatus(db, o) {
  const cred = await zrCreds(db);
  const headers = zrHeaders(cred);
  const tracking = o.zr.tracking;
  const parcelId = o.zr.parcelId;

  // Prefer the direct get-by-id lookup (we already have the parcel's own UUID) —
  // a plain GET, and it can't get stuck the way a trackingNumber search can if the
  // tracking number was never resolved at creation time. Fall back to searching by
  // tracking number for any older record that has no stored parcelId.
  let row = null;
  if (parcelId) {
    const { res, body } = await zrFetch(ZR_BASE + '/parcels/' + parcelId, { method: 'GET', headers });
    if (res.ok) row = body;
    else if (res.status !== 404) throw new HttpsError('internal', 'ZR Express tracking error: ' + zrErrMsg(body, res.status));
  }
  if (!row) {
    const { res, body } = await zrFetch(ZR_BASE + '/parcels/search', {
      method: 'POST', headers,
      body: JSON.stringify({
        pageNumber: 1, pageSize: 1,
        advancedFilter: { logic: 'and', filters: [{ field: 'trackingNumber', operator: 'eq', value: tracking }] },
      }),
    });
    if (!res.ok) throw new HttpsError('internal', 'ZR Express tracking error: ' + zrErrMsg(body, res.status));
    row = ((body && (body.items || body.data || body.results)) || [])[0];
  }
  if (!row) {
    return {
      carrier: 'zr', tracking,
      stage: 0, alert: null, stageLabels: STAGE_LABELS,
      lastLabel: 'بانتظار معالجة الطرد لدى ZR Express', lastLocation: null, lastDate: null,
      events: [], updatedAt: Date.now(),
    };
  }

  const rawStatus = (row.state && row.state.name) || '';
  const { stage, alert } = zrNormalize(rawStatus);
  return {
    carrier: 'zr', tracking: row.trackingNumber || tracking,
    stage, alert, stageLabels: STAGE_LABELS,
    lastLabel: alert || rawStatus || 'بانتظار المعالجة',
    lastLocation: null,
    lastDate: row.lastStateUpdateAt || null,
    events: [], updatedAt: Date.now(),
  };
}

exports.getParcelStatus = onCall(
  { region: 'us-central1' },
  async (req) => {
    const orderId = req.data && req.data.orderId;
    if (!orderId) throw new HttpsError('invalid-argument', 'orderId is required');

    const db = admin.firestore();
    const ref = db.collection('orders').doc(String(orderId));
    const snap = await ref.get();
    if (!snap.exists) throw new HttpsError('not-found', 'Order not found');
    const o = snap.data();

    let status;
    if (o.noest && o.noest.tracking) status = await fetchNoestStatus(db, o);
    else if (o.yalidine && o.yalidine.tracking) status = await fetchYalidineStatus(db, o);
    else if (o.zr && o.zr.tracking) status = await fetchZrStatus(db, o);
    else throw new HttpsError('failed-precondition', 'لا يوجد طرد مُنشأ لهذا الطلب بعد.');

    const update = { trackingStatus: status };
    // Noest activity proves the parcel was validated — sync the flag so the
    // panel stops showing «أكّديه في Noest للشحن» on already-confirmed parcels.
    if (status.carrier === 'noest' && status.noestValidated && !(o.noest && o.noest.validated)) {
      update['noest.validated'] = true;
    }
    // ZR Express's create call sometimes can't resolve the real tracking number
    // right away (falls back to the internal parcel id) — heal it once a refresh
    // finds the real one, so the admin panel stops showing the raw parcel id.
    if (status.carrier === 'zr' && status.tracking && status.tracking !== o.zr.tracking) {
      update['zr.tracking'] = status.tracking;
    }
    await ref.update(update);
    return status;
  }
);

/* ───────────────────────────────────────────────────────────────
   getNoestLabels: fetches the shipping-label PDF for one or more
   Noest trackings (the label endpoint needs the API token, so the
   admin panel can't link to it directly). Multiple labels are merged
   into a single PDF for one-click batch printing.
   ─────────────────────────────────────────────────────────────── */
exports.getNoestLabels = onCall(
  { region: 'us-central1', timeoutSeconds: 120, memory: '512MiB' },
  async (req) => {
    const trackings = ((req.data && req.data.trackings) || []).map((t) => String(t).trim()).filter(Boolean).slice(0, 50);
    if (!trackings.length) throw new HttpsError('invalid-argument', 'trackings is required');

    const db = admin.firestore();
    const credSnap = await db.collection('private').doc('noest').get();
    const token = String((credSnap.exists ? credSnap.data() : {}).apiToken || '').trim();
    if (!token) throw new HttpsError('failed-precondition', 'أدخلي بيانات Noest أولاً.');
    const headers = { Authorization: 'Bearer ' + token, Accept: 'application/json' };

    const pdfs = [];
    for (const tr of trackings) {
      let res;
      try {
        res = await fetch(NOEST_BASE + '/api/public/get/order/label?tracking=' + encodeURIComponent(tr), { headers });
      } catch (e) {
        throw new HttpsError('unavailable', 'تعذّر الاتصال بـ Noest: ' + e.message);
      }
      if (!res.ok) throw new HttpsError('internal', 'تعذّر جلب وصل ' + tr + ' (HTTP ' + res.status + ')');
      pdfs.push(Buffer.from(await res.arrayBuffer()));
    }

    if (pdfs.length === 1) return { pdf: pdfs[0].toString('base64'), count: 1 };

    // Each Noest label only occupies the top-left quadrant of its A4 page,
    // so tile 4 labels per printed page instead of one per sheet.
    const { PDFDocument } = require('pdf-lib');
    const merged = await PDFDocument.create();
    let page = null, slot = 0, W = 595.28, H = 841.89;
    for (const buf of pdfs) {
      const src = await PDFDocument.load(buf);
      const first = src.getPages()[0];
      const size = first.getSize(); W = size.width; H = size.height;
      const label = await merged.embedPage(first, { left: 0, bottom: H / 2, right: W / 2, top: H });
      if (slot % 4 === 0) page = merged.addPage([W, H]);
      const pos = slot % 4;
      page.drawPage(label, { x: (pos % 2) * (W / 2), y: pos < 2 ? H / 2 : 0 });
      slot++;
    }
    return { pdf: Buffer.from(await merged.save()).toString('base64'), count: pdfs.length };
  }
);

/* ───────────────────────────────────────────────────────────────
   syncNoestFees: fetches the partner's real per-wilaya pricing grid
   from Noest (/api/public/fees) and caches it to the public doc
   delivery_fees/noest, which the storefront reads to price Noest
   deliveries accurately.
   ─────────────────────────────────────────────────────────────── */
exports.syncNoestFees = onCall(
  { region: 'us-central1' },
  async () => {
    const db = admin.firestore();
    const credSnap = await db.collection('private').doc('noest').get();
    const cred = credSnap.exists ? credSnap.data() : {};
    const token = String(cred.apiToken || '').trim();
    if (!token) {
      throw new HttpsError('failed-precondition', 'أدخلي بيانات Noest أولاً.');
    }

    let res, body;
    try {
      res = await fetch(NOEST_BASE + '/api/public/fees', { headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' } });
      body = await res.json();
    } catch (e) {
      throw new HttpsError('unavailable', 'تعذّر جلب أسعار Noest: ' + e.message);
    }
    if (!res.ok) {
      throw new HttpsError('internal', 'Noest fees error: ' + JSON.stringify(body));
    }

    const delivery = (body && body.tarifs && body.tarifs.delivery) || {};
    const fees = {};
    let count = 0;
    for (const k in delivery) {
      const d = delivery[k] || {};
      const wid = String(d.wilaya_id || k);
      const home = parseInt(d.tarif, 10);
      const desk = parseInt(d.tarif_stopdesk, 10);
      if (!isNaN(home) && !isNaN(desk)) { fees[wid] = { home, desk }; count++; }
    }
    await db.collection('delivery_fees').doc('noest').set({ fees, updatedAt: Date.now() });
    return { ok: true, count };
  }
);

/* ───────────────────────────────────────────────────────────────
   syncCarriers: pulls each carrier's real wilaya + commune lists from
   its API and caches them (with per-wilaya fees) to delivery_data/<carrier>,
   which the storefront reads to populate the right lists per carrier.
   ─────────────────────────────────────────────────────────────── */
const WILAYA_NAMES = {"1":["أدرار","Adrar"],"2":["الشلف","Chlef"],"3":["الأغواط","Laghouat"],"4":["أم البواقي","Oum El Bouaghi"],"5":["باتنة","Batna"],"6":["بجاية","Béjaïa"],"7":["بسكرة","Biskra"],"8":["بشار","Béchar"],"9":["البليدة","Blida"],"10":["البويرة","Bouira"],"11":["تمنراست","Tamanrasset"],"12":["تبسة","Tébessa"],"13":["تلمسان","Tlemcen"],"14":["تيارت","Tiaret"],"15":["تيزي وزو","Tizi Ouzou"],"16":["الجزائر","Alger"],"17":["الجلفة","Djelfa"],"18":["جيجل","Jijel"],"19":["سطيف","Sétif"],"20":["سعيدة","Saïda"],"21":["سكيكدة","Skikda"],"22":["سيدي بلعباس","Sidi Bel Abbès"],"23":["عنابة","Annaba"],"24":["قالمة","Guelma"],"25":["قسنطينة","Constantine"],"26":["المدية","Médéa"],"27":["مستغانم","Mostaganem"],"28":["المسيلة","M'Sila"],"29":["معسكر","Mascara"],"30":["ورقلة","Ouargla"],"31":["وهران","Oran"],"32":["البيض","El Bayadh"],"33":["إليزي","Illizi"],"34":["برج بوعريريج","Bordj Bou Arréridj"],"35":["بومرداس","Boumerdès"],"36":["الطارف","El Tarf"],"37":["تندوف","Tindouf"],"38":["تيسمسيلت","Tissemsilt"],"39":["الوادي","El Oued"],"40":["خنشلة","Khenchela"],"41":["سوق أهراس","Souk Ahras"],"42":["تيبازة","Tipaza"],"43":["ميلة","Mila"],"44":["عين الدفلى","Aïn Defla"],"45":["النعامة","Naâma"],"46":["عين تموشنت","Aïn Témouchent"],"47":["غرداية","Ghardaïa"],"48":["غليزان","Relizane"],"49":["تيميمون","Timimoun"],"50":["برج باجي مختار","Bordj Badji Mokhtar"],"51":["أولاد جلال","Ouled Djellal"],"52":["بني عباس","Béni Abbès"],"53":["عين صالح","In Salah"],"54":["عين قزام","In Guezzam"],"55":["تقرت","Touggourt"],"56":["جانت","Djanet"],"57":["المغير","El M'Ghair"],"58":["المنيعة","El Meniaa"]};
const YAL_FEES = {"1":[1400,1200],"2":[900,400],"3":[1050,600],"4":[900,400],"5":[900,400],"6":[900,400],"7":[1050,600],"8":[1400,800],"9":[750,350],"10":[900,400],"11":[1600,1200],"12":[1050,600],"13":[900,400],"14":[900,400],"15":[900,400],"16":[500,300],"17":[1050,600],"18":[900,400],"19":[900,400],"20":[900,400],"21":[900,400],"22":[900,400],"23":[900,400],"24":[900,400],"25":[900,400],"26":[900,400],"27":[900,400],"28":[900,400],"29":[900,400],"30":[1050,600],"31":[900,400],"32":[1050,600],"33":[1800,1200],"34":[900,400],"35":[750,350],"36":[900,400],"37":[1800,1200],"38":[900,400],"39":[1050,600],"40":[900,400],"41":[900,400],"42":[750,350],"43":[900,400],"44":[900,400],"45":[1050,600],"46":[900,400],"47":[1050,600],"48":[900,400],"49":[1400,800],"50":[1800,1200],"51":[1050,600],"52":[1400,800],"53":[1600,1200],"54":[1800,1200],"55":[1050,600],"56":[1800,1200],"57":[1050,600],"58":[1050,600]};
const NOEST_FEES = {"1":[1500,700],"2":[950,450],"3":[850,400],"4":[850,400],"5":[850,400],"6":[900,400],"7":[950,450],"8":[1300,650],"9":[800,350],"10":[800,350],"11":[2000,1000],"12":[850,400],"13":[950,450],"14":[950,450],"15":[800,350],"16":[800,350],"17":[950,450],"18":[900,400],"19":[850,400],"20":[950,450],"21":[900,400],"22":[950,450],"23":[800,350],"24":[900,400],"25":[900,400],"26":[800,350],"27":[950,450],"28":[850,400],"29":[950,450],"30":[800,350],"31":[800,350],"32":[1000,500],"33":[1950,950],"34":[850,400],"35":[800,350],"36":[950,450],"37":[1750,850],"38":[950,450],"39":[800,350],"40":[850,400],"41":[900,400],"42":[800,350],"43":[900,400],"44":[950,450],"45":[1100,550],"46":[950,450],"47":[950,450],"48":[950,450],"49":[1200,600],"50":[1800,1200],"51":[950,450],"52":[1450,650],"53":[1650,850],"54":[1800,1200],"55":[700,300],"56":[2200,1600],"57":[850,300],"58":[1000,500]};

async function writeCarrierData(db, name, wilayaIds, communesByW, feeTable) {
  const ids = wilayaIds.map(Number).filter((id) => WILAYA_NAMES[id]).sort((a, b) => a - b);
  const wilayas = ids.map((id) => ({ id, ar: WILAYA_NAMES[id][0], fr: WILAYA_NAMES[id][1] }));
  const communes = {};
  Object.keys(communesByW).forEach((wid) => {
    const seen = new Set(); const out = [];
    (communesByW[wid] || []).forEach((n) => { const t = String(n || '').trim(); if (t && !seen.has(t)) { seen.add(t); out.push(t); } });
    out.sort((a, b) => a.localeCompare(b));
    communes[String(wid)] = out;
  });
  const fees = {};
  ids.forEach((id) => { const f = feeTable[id]; if (f) fees[String(id)] = { home: f[0], desk: f[1] }; });
  await db.collection('delivery_data').doc(name).set({ wilayas, communes, fees, updatedAt: Date.now() });
  return { wilayas: wilayas.length, communes: Object.values(communes).reduce((a, b) => a + b.length, 0) };
}

exports.syncCarriers = onCall(
  { region: 'us-central1', timeoutSeconds: 120 },
  async () => {
    const db = admin.firestore();
    const yalSnap = await db.collection('private').doc('yalidine').get();
    const noSnap = await db.collection('private').doc('noest').get();
    const yal = yalSnap.exists ? yalSnap.data() : {};
    const no = noSnap.exists ? noSnap.data() : {};
    const out = {};

    // YALIDINE
    if (yal.apiId && yal.apiToken) {
      const h = { 'X-API-ID': String(yal.apiId), 'X-API-TOKEN': String(yal.apiToken) };
      const wj = await (await fetch('https://api.yalidine.app/v1/wilayas/?page_size=100', { headers: h })).json();
      const wIds = (wj.data || []).map((w) => w.id);
      const byW = {};
      let page = 1, more = true;
      while (more && page <= 4) {
        const cj = await (await fetch('https://api.yalidine.app/v1/communes/?page_size=1000&page=' + page, { headers: h })).json();
        (cj.data || []).forEach((c) => { if (c.is_deliverable) { (byW[c.wilaya_id] = byW[c.wilaya_id] || []).push(c.name); } });
        more = !!cj.has_more; page++;
      }
      out.yalidine = await writeCarrierData(db, 'yalidine', wIds, byW, YAL_FEES);
    }

    // NOEST
    if (no.apiToken) {
      const h = { Authorization: 'Bearer ' + String(no.apiToken), Accept: 'application/json' };
      const wRaw = await (await fetch('https://app.noest-dz.com/api/public/get/wilayas', { headers: h })).json();
      const wArr = (Array.isArray(wRaw) ? wRaw : Object.values(wRaw)).filter((w) => w.is_active != 0);
      const cRaw = await (await fetch('https://app.noest-dz.com/api/public/get/communes', { headers: h })).json();
      const cArr = Array.isArray(cRaw) ? cRaw : Object.values(cRaw);
      const byW = {};
      cArr.forEach((c) => { if (c.is_active != 0) { (byW[c.wilaya_id] = byW[c.wilaya_id] || []).push(c.nom); } });
      out.noest = await writeCarrierData(db, 'noest', wArr.map((w) => w.code), byW, NOEST_FEES);
    }

    // ZR EXPRESS — its wilaya/commune list is keyed by UUID territory, not the
    // standard 1-58 numbering, and it exposes no fee grid — normalise it to the
    // same shape as Yalidine/Noest (by wilaya `code`, priced with YAL_FEES) so
    // the storefront's carrier lookups stay carrier-agnostic.
    const zrSnap = await db.collection('private').doc('zrexpress').get();
    const zr = zrSnap.exists ? zrSnap.data() : {};
    if (zr.tenantId && zr.secretKey) {
      const rows = await zrAllTerritories(zrHeaders(zr));

      const wilayaIds = [];
      const codeById = {}; // wilaya UUID -> numeric wilaya code
      rows.forEach((t) => {
        if (t.level !== 'wilaya') return;
        const del = t.delivery || {};
        if (del.hasHomeDelivery === false && !del.hasPickupPoint) return;
        const code = Number(t.code);
        if (!code) return;
        wilayaIds.push(code); codeById[t.id] = code;
      });
      const byW = {};
      rows.forEach((t) => {
        if (t.level !== 'commune' || !t.parentId || codeById[t.parentId] == null) return;
        const del = t.delivery || {};
        if (del.hasHomeDelivery === false && !del.hasPickupPoint) return;
        (byW[codeById[t.parentId]] = byW[codeById[t.parentId]] || []).push(t.name);
      });
      out.zr = await writeCarrierData(db, 'zr', wilayaIds, byW, YAL_FEES);
    }
    return { ok: true, result: out };
  }
);

/* ───────────────────────────────────────────────────────────────
   Notifications — email + web push on new orders / messages.

   Email: sent with nodemailer through Gmail SMTP. The Gmail address and
   an App Password are entered in the admin Settings page and stored in
   the server-only doc `private/notify` ({ gmail, appPass }).

   Web push: VAPID keys are auto-generated on first use and kept in
   `private/webpush`. Devices subscribe from the admin panel (getPushKey
   callable → PushManager.subscribe) and store their subscription in the
   `push_subs` collection; dead subscriptions are pruned on send.
   ─────────────────────────────────────────────────────────────── */
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const webpush = require('web-push');
const nodemailer = require('nodemailer');

const ADMIN_URL = 'https://www.desertshop.fit/amelhadj';

async function getVapidKeys(db) {
  const ref = db.collection('private').doc('webpush');
  const snap = await ref.get();
  if (snap.exists && snap.data().publicKey) return snap.data();
  const keys = webpush.generateVAPIDKeys();
  await ref.set(keys);
  return keys;
}

exports.getPushKey = onCall({ region: 'us-central1' }, async () => {
  const keys = await getVapidKeys(admin.firestore());
  return { publicKey: keys.publicKey };
});

async function sendPush(db, payload) {
  const keysSnap = await db.collection('private').doc('webpush').get();
  if (!keysSnap.exists) return; // no device ever subscribed
  const keys = keysSnap.data();
  webpush.setVapidDetails('mailto:tango0es@gmail.com', keys.publicKey, keys.privateKey);
  const subs = await db.collection('push_subs').get();
  const body = JSON.stringify(payload);
  await Promise.all(subs.docs.map(async (d) => {
    try {
      await webpush.sendNotification(JSON.parse(d.data().sub), body);
    } catch (e) {
      // 404/410 = subscription expired or unsubscribed — remove it.
      if (e.statusCode === 404 || e.statusCode === 410) await d.ref.delete().catch(() => {});
      else console.error('push failed', e.statusCode || e.message);
    }
  }));
}

async function sendEmail(db, subject, html) {
  const credSnap = await db.collection('private').doc('notify').get();
  const cred = credSnap.exists ? credSnap.data() : {};
  const gmail = String(cred.gmail || '').trim();
  const appPass = String(cred.appPass || '').replace(/\s/g, '');
  if (!gmail || !appPass) return; // email notifications not configured
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmail, pass: appPass },
  });
  await transporter.sendMail({
    from: `"Desert Shop" <${gmail}>`,
    to: gmail,
    subject,
    html: html + `<p style="margin-top:16px"><a href="${ADMIN_URL}">فتح لوحة التحكم</a></p>`,
  });
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function fmtDA(v) {
  const n = parseInt(String(v == null ? '' : v).replace(/[^0-9]/g, '') || '0', 10) || 0;
  return n.toLocaleString('en-US') + ' د.ج';
}

async function notifyAll(db, { title, text, html }) {
  const results = await Promise.allSettled([
    sendPush(db, { title, body: text, url: ADMIN_URL }),
    sendEmail(db, title, html),
  ]);
  results.forEach((r) => { if (r.status === 'rejected') console.error('notify failed', r.reason); });
}

exports.onNewOrder = onDocumentCreated(
  { document: 'orders/{id}', region: 'us-central1' },
  async (event) => {
    const o = event.data ? event.data.data() : null;
    if (!o) return;
    // Phone orders entered by the store owner herself — no self-notification.
    if (o.source === 'admin_phone') return;
    const db = admin.firestore();
    const items = (o.items || []).map((it) => `${it.title} ×${it.qty || it.quantity || 1}`);
    const title = `🛒 طلب جديد ${o.num || event.params.id} — ${fmtDA(o.total != null ? o.total : o.subtotal)}`;
    const text = `${o.customer || ''} · ${o.wilaya || ''} - ${o.baladiya || ''} · ${items.join('، ')}`;
    const html =
      `<div dir="rtl" style="font-family:sans-serif;line-height:1.8">` +
      `<h2 style="margin:0 0 8px">🛒 طلب جديد ${esc(o.num || event.params.id)}</h2>` +
      `<p style="margin:0"><b>الزبون:</b> ${esc(o.customer)} · <b dir="ltr">${esc(o.phone)}</b><br>` +
      `<b>العنوان:</b> ${esc(o.wilaya)} - ${esc(o.baladiya)} (${o.deliveryType === 'office' ? 'مكتب Stop Desk' : 'توصيل للمنزل'})<br>` +
      `<b>المنتجات:</b> ${items.map(esc).join('، ') || '—'}<br>` +
      `<b>المجموع:</b> ${fmtDA(o.total != null ? o.total : o.subtotal)}` +
      (o.deliveryFee != null ? ` (منتجات ${fmtDA(o.subtotal)} + توصيل ${fmtDA(o.deliveryFee)})` : '') +
      `</p></div>`;
    await notifyAll(db, { title, text, html });
  }
);

exports.onNewMessage = onDocumentCreated(
  { document: 'messages/{id}', region: 'us-central1' },
  async (event) => {
    const m = event.data ? event.data.data() : null;
    if (!m) return;
    const db = admin.firestore();
    const title = `💬 رسالة جديدة من ${m.name || 'زائر'}`;
    const text = String(m.message || '').slice(0, 180);
    const html =
      `<div dir="rtl" style="font-family:sans-serif;line-height:1.8">` +
      `<h2 style="margin:0 0 8px">💬 رسالة جديدة</h2>` +
      `<p style="margin:0"><b>الاسم:</b> ${esc(m.name)} · <b dir="ltr">${esc(m.phone || '—')}</b><br>` +
      `<b>الرسالة:</b> ${esc(m.message)}</p></div>`;
    await notifyAll(db, { title, text, html });
  }
);

// Manual check for the email settings — called from the admin Settings page.
exports.sendTestEmail = onCall({ region: 'us-central1' }, async () => {
  const db = admin.firestore();
  const credSnap = await db.collection('private').doc('notify').get();
  const cred = credSnap.exists ? credSnap.data() : {};
  if (!String(cred.gmail || '').trim() || !String(cred.appPass || '').trim()) {
    throw new HttpsError('failed-precondition', 'أدخلي بريد Gmail و App Password واحفظيهما أولاً');
  }
  try {
    await sendEmail(db, '✅ تجربة إشعارات Desert Shop',
      '<div dir="rtl" style="font-family:sans-serif">إعدادات البريد تعمل بنجاح 🎉 — ستصلكِ رسالة كهذه عند كل طلب أو رسالة جديدة.</div>');
  } catch (e) {
    if (e && (e.code === 'EAUTH' || e.responseCode === 535)) {
      throw new HttpsError('failed-precondition',
        'رفض Gmail تسجيل الدخول: تأكدي أن كلمة المرور هي App Password (وليست كلمة سر الحساب) وأن التحقق بخطوتين مفعّل');
    }
    throw new HttpsError('internal', 'فشل الإرسال: ' + (e && e.message ? e.message : e));
  }
  return { ok: true };
});
