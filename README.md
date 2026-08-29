# Royal Eye Candy

Custom DTF transfer, gang sheet, apparel, signage, and vehicle wrap printing
e-commerce site for Royal Eye Candy (Boise, Idaho). Built with Next.js,
Supabase, Stripe, and Resend.

## Tech stack

- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- **Database/ORM:** Supabase Postgres via Prisma
- **Auth & Storage:** Supabase Auth + Supabase Storage (artwork uploads)
- **Payments:** Stripe Checkout (Card, Apple Pay, Google Pay, Link)
- **Email:** Resend (order confirmations, shipping notifications, contact form)
- **Cart:** Zustand (persisted to `localStorage` for guest carts)

## What works right now vs. what needs setup

The site is fully built and browsable with **zero configuration** — every page,
the live pricing calculators, the artwork uploader (with low-resolution
warnings), and the cart all work immediately with `npm run dev`.

Features that touch a real backend degrade gracefully until you add
credentials (you'll see a "Setup needed" notice instead of a crash):

- Checkout (needs Stripe keys)
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

## 3. Create a Stripe account

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com), grab your
   **test mode** keys from Developers → API keys.
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
2. Apple Pay, Google Pay, and Link appear automatically in Stripe Checkout
   once enabled for your account/domain — no extra code needed. (Shopify's
   "Shop Pay" wallet isn't available outside Shopify, so it's not included;
   Link is Stripe's equivalent one-click checkout.)
3. **Webhook (for order confirmation emails + marking orders paid):**
   - Local development: `npx stripe listen --forward-to localhost:3000/api/webhooks/stripe`
     and copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`.
   - Production: Developers → Webhooks → Add endpoint →
     `https://yourdomain.com/api/webhooks/stripe`, subscribe to
     `checkout.session.completed`, copy its signing secret into
     `STRIPE_WEBHOOK_SECRET`.
4. Test checkout with card `4242 4242 4242 4242`, any future expiry/CVC.

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
  /cart, /checkout           Cart + Stripe checkout flow
  /account/*                 Customer auth, orders, invoices, saved artwork
  /admin/*                   Product/order/coupon management, sales reports
  /api/*                     Checkout, Stripe webhook, artwork upload, contact,
                             newsletter, coupon validation
src/components/             UI, organized by area (layout, home, product, cart,
                             account, admin)
src/lib/                    pricing.ts (rate tables — edit these to change what
                             customers are quoted), stripe.ts, resend.ts,
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
the environment variables from `.env.example`, and set the Stripe webhook
endpoint to your production URL (step 3 above). Run
`npx prisma migrate deploy` against production `DATABASE_URL`/`DIRECT_URL`
before first launch.
