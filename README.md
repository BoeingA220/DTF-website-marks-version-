# Royal Eye Candy

Custom DTF transfer, gang sheet, apparel, signage, and vehicle wrap printing
e-commerce site for Royal Eye Candy (Boise, Idaho). Built with Next.js,
Supabase, Square, and Resend.

## Tech stack

- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- **Database/ORM:** Supabase Postgres via Prisma
- **Auth & Storage:** Supabase Auth + Supabase Storage (artwork uploads)
- **Payments:** Square Checkout (Card, Apple Pay, Google Pay, Cash App Pay)
- **Email:** Resend (order confirmations, shipping notifications, contact form)
- **Cart:** Zustand (persisted to `localStorage` for guest carts)

## What works right now vs. what needs setup

The site is fully built and browsable with **zero configuration** — every page,
the live pricing calculators, the artwork uploader (with low-resolution
warnings), and the cart all work immediately with `npm run dev`.

Features that touch a real backend degrade gracefully until you add
credentials (you'll see a "Setup needed" notice instead of a crash):

- Checkout (needs Square keys)
- Accounts, order history, saved artwork (needs Supabase + `DATABASE_URL`)
- Admin dashboard (needs Supabase + `DATABASE_URL`)
- Artwork persisting to storage (needs Supabase Storage)
- Transactional email (needs Resend)

Follow the steps below to wire up each one.

## 1. Install dependencies

```bash
npm install
```

## 2. Create a Supabase project (database, auth, storage)

1. Go to [supabase.com](https://supabase.com), create a free project.
2. **Database URLs:** Project Settings → Database → Connection string.
   - Copy the **Transaction pooler** string (port `6543`) into `DATABASE_URL`.
   - Copy the **Session/direct** string (port `5432`) into `DIRECT_URL`.
3. **API keys:** Project Settings → API.
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, keep secret)
4. **Storage:** Storage → New bucket → name it `artwork` → **private** (not
   public). The app generates signed URLs for previews server-side, so the
   bucket never needs to be public.
5. Copy `.env.example` to `.env.local` and fill in the values above.

Then create the database tables:

```bash
npx prisma migrate dev --name init
```

## 3. Create a Square account

1. Go to [developer.squareup.com](https://developer.squareup.com/apps), sign in
   with (or create) a Square account, and create an application.
2. On the app's dashboard, switch to the **Sandbox** tab for testing:
   - `Sandbox Access Token` → `SQUARE_ACCESS_TOKEN`
   - Under **Locations**, copy the sandbox test location's ID → `SQUARE_LOCATION_ID`
   - Leave `SQUARE_ENVIRONMENT="sandbox"`
3. Apple Pay, Google Pay, and Cash App Pay appear automatically on Square's
   hosted checkout page — no extra code needed. (Stripe's "Link" and
   Shopify's "Shop Pay" are each specific to their own checkout, so Square's
   closest equivalent one-tap options are used instead.)
4. **Webhook (for order confirmation emails + marking orders paid):**
   - In the app dashboard, go to **Webhooks**, add a subscription pointing to
     `https://yourdomain.com/api/webhooks/square` and subscribe to the
     `payment.updated` event.
   - Copy the subscription's **Signature Key** into `SQUARE_WEBHOOK_SIGNATURE_KEY`.
   - Square requires a real HTTPS URL for webhooks — for local testing, run a
     tunnel (e.g. `ngrok http 3000`) and register the tunnel's HTTPS URL +
     `/api/webhooks/square` as the subscription's notification URL, and set
     `NEXT_PUBLIC_SITE_URL` to that same tunnel URL while testing (the app
     verifies each webhook's signature against this exact URL).
5. Test checkout in Sandbox mode using Square's documented [sandbox test card
   numbers](https://developer.squareup.com/docs/testing/test-values) (any
   future expiry, any CVV/postal code).
6. **Going live:** switch to the app's **Production** tab, use the production
   access token + your real location's ID, set `SQUARE_ENVIRONMENT="production"`,
   and register a second webhook subscription for your live domain.

## 4. Create a Resend account (email)

1. Go to [resend.com](https://resend.com), create an API key →
   `RESEND_API_KEY`.
2. Verify a sending domain (or use Resend's shared testing domain while
   developing) and set `RESEND_FROM_EMAIL`.
3. Without this configured, emails are logged to the server console instead
   of sent — nothing breaks, you just won't receive them.

## 5. Make yourself an admin

1. Register a normal account at `/account/register`.
2. In the Supabase dashboard, go to Table Editor → `profiles`, find your row,
   and change `role` from `CUSTOMER` to `ADMIN`.
3. Visit `/admin`.

## 6. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Project structure

```
prisma/schema.prisma        Database schema (products, orders, coupons, etc.)
src/app/                    Pages & API routes (App Router)
  (marketing pages)         /, /shop, /gang-sheets, /apparel, /sublimation,
                             /stickers, /posters, /canvas, /storefront-lettering,
                             /vinyl-printing, /vehicle-wraps, /pricing, /about,
                             /faq, /contact
  /cart, /checkout           Cart + Square checkout flow
  /account/*                 Customer auth, orders, invoices, saved artwork
  /admin/*                   Product/order/coupon management, sales reports
  /api/*                     Checkout, Square webhook, artwork upload, contact,
                             newsletter, coupon validation
src/components/             UI, organized by area (layout, home, product, cart,
                             account, admin)
src/lib/                    pricing.ts (rate tables — edit these to change what
                             customers are quoted), square.ts, resend.ts,
                             supabase/*, prisma.ts, auth.ts
src/store/cart-store.ts     Zustand cart (persisted to localStorage)
```

## Editing prices

Base pricing lives in `src/lib/pricing.ts` as plain rate tables/functions
(shared by both the instant-quote UI and the server-side checkout
re-validation, so a price shown to a customer is guaranteed to match what
they're actually charged). Edit the constants there — `DTF_AREA_RATE_TIERS`,
`GANG_SHEET_LENGTHS`, `APPAREL_STYLES`, `getShippingOptions` — to change rates.
The Admin → Products page manages catalog entries, inventory counts, and SEO
metadata, not these rate tables.

## Branding

The eye logo at `public/logo/eye-mark.svg` is a placeholder built from the
brand's color palette. Swap it for the real business-card logo whenever it's
available — `src/components/layout/Logo.tsx` is the only place it's referenced.

## Deploying

Deploys cleanly to [Vercel](https://vercel.com/new): connect the repo, add all
the environment variables from `.env.example`, and set the Square webhook
endpoint to your production URL (step 3 above). Run
`npx prisma migrate deploy` against production `DATABASE_URL`/`DIRECT_URL`
before first launch.
