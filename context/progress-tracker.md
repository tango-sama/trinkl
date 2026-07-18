# Progress Tracker

State of the live site (desert-shop-24af9.web.app). Keep this in sync with what is actually deployed, per `development-workflow.md`.

## Done (deployed)

- Storefront: home, products, product detail, categories, collagen landing page, checkout — RTL Arabic, Blush Rose & Gold theme.
- Cart in localStorage; orders created in Firestore at checkout; optional WhatsApp order confirmation.
- Admin panel (`amelhadj.html`): products, categories, featured, orders, messages, income/expenses ledger, settings.
- Delivery carriers: Yalidine, Noest, ZR Express — parcel creation (idempotent), tracking lookup, synced fee grids (`delivery_fees` / `delivery_data`), per-carrier enable toggles.
- Admin notifications: web push (`push_subs` + `push-sw.js`) and Gmail email on new orders/messages.
- Security lockdown (2026-07-19): admin panel gated by Firebase Auth email/password (`tango0es@gmail.com`); `firestore.rules` — catalog public-read/admin-write, orders & messages create-only for clients, customer data and expenses admin-only, `private/*` credentials never client-readable.
- WhatsApp site-wide toggle (2026-07-19): `site_settings.waEnabled` + admin Settings button; hides every WA button/link via `html.no-wa` and guards JS openers. Default: enabled.

## In Progress

- (nothing)

## Open Questions

- (none — add one instead of guessing when a requirement is missing)

## Backlog / Carry To Clone

- Port the security lockdown (auth gate + tightened rules) to Bazar Merabet (`mrabet-fb38c`) — its rules are still wide open.
- Port the WhatsApp toggle to Bazar Merabet when rebasing it on this codebase.
- Consider committing the four product images in `assets/collagen/` (referenced by the live site but untracked in git).
