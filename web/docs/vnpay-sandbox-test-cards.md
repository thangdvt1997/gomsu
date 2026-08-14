# VNPay sandbox setup

1. Register a merchant sandbox account at https://sandbox.vnpayment.vn to get a `vnp_TmnCode` (terminal code) and `vnp_HashSecret`. Set these as `VNPAY_TMN_CODE` / `VNPAY_HASH_SECRET` in `web/.env` on the server (never commit them).
2. In the VNPay sandbox merchant dashboard, configure the IPN URL to `https://<domain>/api/vnpay/ipn` (or the staging host during testing). This can't be passed as a request parameter — it's a one-time dashboard setting per merchant account.
3. Test card numbers, OTPs, and bank simulators are published on VNPay's own sandbox docs and rotate over time — look them up there rather than trusting a copy pasted into this repo.
4. To go to production later: swap `VNPAY_PAYMENT_URL` to the production endpoint and use the production `vnp_TmnCode`/`vnp_HashSecret` — no code changes needed, the same `lib/vnpay/*` code path handles both.
