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

    // Stopdesk needs a center id; look one up in the destination wilaya.
    const isStopdesk = (o.deliveryType === 'office' || o.deliveryType === 'desk');
    let stopdeskId = null;
    if (isStopdesk && o.wilayaId) {
      try {
        const cRes = await fetch(`${API_BASE}/centers/?wilaya_id=${encodeURIComponent(o.wilayaId)}`, { headers });
        if (cRes.ok) {
          const cj = await cRes.json();
          const centers = (cj && cj.data) || [];
          if (centers.length) stopdeskId = centers[0].center_id;
        }
      } catch (e) { /* fall back to home delivery below */ }
    }

    // Split full name into first / family.
    const fullName = String(o.customer || '').trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    const firstname = parts.shift() || fullName || '—';
    const familyname = parts.join(' ') || firstname;

    const productList = ((o.items || []).map((it) => `${it.title} x${it.qty || 1}`).join(', ') || 'منتجات').slice(0, 250);
    const codPrice = Number(o.total != null ? o.total : o.subtotal) || 0;
    const useStopdesk = isStopdesk && !!stopdeskId;

    const parcel = {
      order_id: String(o.num || orderId),
      from_wilaya_name: fromWilaya,
      firstname,
      familyname,
      contact_phone: String(o.phone || '').replace(/\s/g, ''),
      address: `${o.baladiya || ''} - ${o.wilaya || ''}`.trim(),
      to_commune_name: o.communeFr || o.baladiya || '',
      to_wilaya_name: o.wilayaFr || o.wilaya || '',
      product_list: productList,
      price: codPrice,
      do_insurance: false,
      declared_value: codPrice,
      length: 0, width: 0, height: 0, weight: 1,
      freeshipping: false,
      is_stopdesk: useStopdesk,
      stopdesk_id: useStopdesk ? stopdeskId : null,
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
