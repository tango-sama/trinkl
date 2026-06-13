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
    const codPrice = Number(o.total != null ? o.total : o.subtotal) || 0;
    const useStopdesk = isStopdesk && !!stopdeskCenter;

    const parcel = {
      order_id: String(o.num || orderId),
      from_wilaya_name: fromWilaya,
      firstname,
      familyname,
      contact_phone: String(o.phone || '').replace(/\s/g, ''),
      address: `${o.baladiya || ''} - ${o.wilaya || ''}`.trim(),
      to_commune_name: useStopdesk ? stopdeskCenter.commune_name : (o.communeFr || o.baladiya || ''),
      to_wilaya_name: useStopdesk ? (stopdeskCenter.wilaya_name || o.wilayaFr || o.wilaya) : (o.wilayaFr || o.wilaya || ''),
      product_list: productList,
      price: codPrice,
      do_insurance: false,
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

    const headers = { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' };

    // Stopdesk needs a station code in the destination wilaya.
    const isStopdesk = (o.deliveryType === 'office' || o.deliveryType === 'desk');
    let stationCode = null;
    if (isStopdesk) {
      try {
        const dRes = await fetch(NOEST_BASE + '/api/public/desks', { headers });
        if (dRes.ok) {
          const desks = await dRes.json();
          for (const k in desks) {
            const code = String((desks[k] && desks[k].code) || '');
            const m = code.match(/^(\d+)/);
            if (m && parseInt(m[1], 10) === Number(o.wilayaId)) { stationCode = code; break; }
          }
        }
      } catch (e) { /* fall back to home delivery */ }
    }
    const useStopdesk = isStopdesk && !!stationCode;

    const productList = (o.deliveryLabel && String(o.deliveryLabel).trim())
      ? String(o.deliveryLabel).trim().slice(0, 250)
      : ((o.items || []).map((it) => `${it.title} x${it.qty || 1}`).join(', ') || 'منتجات').slice(0, 250);
    const montant = Number(o.total != null ? o.total : o.subtotal) || 0;

    const payload = {
      user_guid: guid,
      reference: String(o.num || ('DS-' + orderId)),
      client: (String(o.customer || '').trim() || '—').slice(0, 255),
      phone: String(o.phone || '').replace(/\s/g, ''),
      adresse: (`${o.baladiya || ''} - ${o.wilaya || ''}`).trim().slice(0, 255) || String(o.wilaya || '—'),
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
      res = await fetch(NOEST_BASE + '/api/public/fees', { headers: { Authorization: 'Bearer ' + token } });
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
