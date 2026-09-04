# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes. It must reflect the actual, deployed state of desert-shop-24af9.web.app — not the intended state (see `development-workflow.md`).

## Current Phase

- Live in production — maintenance and incremental features.

## Current Goal

- Meta Pixel + Conversions API implemented (2026-08-24), not yet deployed — see Next Up.

## Completed

- Storefront: home, products, product detail, categories, collagen landing page, checkout — RTL Arabic, Blush Rose & Gold theme.
- Cart in localStorage; orders created in Firestore at checkout; optional WhatsApp order confirmation.
- Admin panel (`amelhadj.html`): products, categories, featured, orders, messages, income/expenses ledger, settings.
- Meta Pixel + Conversions API (2026-08-24): browser Pixel (`js/meta.js`, `window.Meta`) fires PageView/ViewContent/AddToCart/InitiateCheckout/Purchase; server CAPI mirrors ViewContent/AddToCart/InitiateCheckout via the `logMetaEvent` callable, and Purchase via the `onOrderCreatedMetaPurchase` Firestore trigger (fires only after an order doc is actually created — never from client code). Same client-generated `event_id` on both legs for Meta's deduplication. Credentials in `private/meta` (server-only, via Admin SDK); Pixel ID + on/off toggle in `site_settings` (admin Settings page, new "Meta Pixel + Conversions API" card). Idempotency via `order.meta.purchaseSent`. Skips seller-entered phone orders (`source: admin_phone`).
- Delivery carriers: Yalidine, Noest, ZR Express — idempotent parcel creation, tracking lookup, synced fee grids (`delivery_fees` / `delivery_data`), per-carrier enable toggles.
- Admin notifications: web push (`push_subs` + `push-sw.js`) and Gmail email on new orders/messages.
- Security lockdown (2026-07-19): admin panel gated by Firebase Auth email/password; `firestore.rules` tightened — catalog public-read/admin-write, orders & messages create-only for clients, customer data and expenses admin-only.
- WhatsApp site-wide toggle (2026-07-19): `site_settings.waEnabled` + admin Settings button; hides every WA surface via `html.no-wa` and guards JS openers.
- Context docs (2026-07-19): `CLAUDE.md` + `context/` folder; internal files excluded from Hosting (were publicly downloadable).
- Growth Phase 1 — canonical order outcome (2026-09-04): every place that writes
  `trackingStatus` now also writes a flat `outcome` string
  (`new`/`confirmed`/`shipped`/`delivered`/`returned`/`cancelled`) plus
  `outcomeAt`, via the new `outcomeFromStatus()` / `withOutcome()` helpers in
  `functions/index.js`. Applied at all three status write points
  (`getParcelStatus`, `zrWebhook`, `yalidineWebhook`) and at all three parcel
  creation sites (which stamp `confirmed`). `trackingStatus` is a rendering
  model — a stage index and an alert string shaped for the admin stepper — so
  it cannot be queried or aggregated; `outcome` is what makes "how many of last
  month's Meta orders actually delivered?" answerable, which the profit engine
  needs. Derived from the EXISTING per-carrier normalizers only; no new carrier
  logic and no migration (older orders simply have no `outcome`). Return alerts
  map to `returned`, but transient alerts ("الزبون لا يرد", "مشكلة في التوصيل")
  deliberately stay `shipped` — writing those off as returns would discard
  orders that go on to deliver. `withOutcome()` refuses to move an order
  backwards so a late/out-of-order webhook cannot un-deliver a completed order,
  while still allowing `delivered → returned`. Verified against all 7 alert
  strings the normalizers emit (14 assertions, all passing).
- Growth Phase 1 — analytics collections locked down (2026-09-04):
  `firestore.rules` now denies ALL client writes to `marketing/`, `analytics/`,
  `funnels/`, `experiments/` and `ai/`, admin-read-only. Closed rather than
  create-only (unlike `orders`/`messages`, which an anonymous customer must be
  able to submit to): nothing in these collections is authored by a visitor's
  browser, and leaving create open would let anyone forge conversions and ad
  spend directly into the numbers budget decisions are made from. Written
  server-side only, via Admin SDK.

## In Progress

- Meta Pixel + CAPI: code complete, verified locally (client-side logic end-to-end; server functions syntax-checked but not deployed). Still needed before it does anything live: deploy `functions` (adds `logMetaEvent` + `onOrderCreatedMetaPurchase`), then enter the Pixel ID + Conversions API access token in the admin Settings page ("Meta Pixel + Conversions API" card).

## Next Up

- **Deploy the `outcome` work**: `firebase deploy --only functions,firestore:rules`.
  Until the functions deploy, no order gets an `outcome` and the growth
  dashboard's delivery/return rates stay empty. Rules can deploy independently
  and are safe on their own (they only close collections nothing writes yet).
- Deploy the Meta Pixel/CAPI functions and fill in real credentials (see above), then verify with Meta Events Manager → Test Events per the implementation report.
- Port the security lockdown (auth gate + tightened rules) to Bazar Merabet (`mrabet-fb38c`) — its rules are still wide open, exposing its customer orders.
- Port the WhatsApp toggle to Bazar Merabet in the same pass.
- Commit the four untracked product images in `assets/collagen/` (referenced by the live site).

## Open Questions

- None. Add one here instead of guessing when a requirement is missing.

## Architecture Decisions

- Static site, no framework, no build step — files deploy as-is to Firebase Hosting.
- Firestore schema is append-only: new code tolerates old document shapes; no migrations.
- Single-admin auth: Firebase Auth email/password, `isAdmin()` in rules checks the exact admin email; customers stay anonymous.
- Carrier credentials live only in server-only `private/*` docs, read by Cloud Functions via Admin SDK.
- Parcel creation is idempotent per order per carrier — safe to re-run.
- `sw.js` is a permanent kill-switch: the site must never register a caching service worker again.
- Branding stays in theme tokens and the `SITE` config so the Bazar Merabet clone can rebase cleanly.
- Meta Purchase CAPI is sent by a Firestore trigger on `orders/{orderId}` creation, not by a client call after checkout — there's no order-creation API to hook (the browser writes orders straight to Firestore), so the trigger is the only point that's guaranteed to fire after — and only after — an order actually exists.

## Session Notes

- 2026-07-19: Security lockdown designed, deployed, and REST-verified (catalog 200, customer data 403, order create 200). Admin password is set in the Firebase console and known only to the owner — sign in once per device at `/amelhadj`. WhatsApp toggle added and deployed (default: enabled). Deploys run from this machine with the Firebase CLI (`firebase deploy --only hosting|firestore:rules|functions`).
- A test order named "TEST - rules check (delete me)" was created during rules verification — owner should delete it from the admin panel if not done yet.
