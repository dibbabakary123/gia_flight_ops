# GIA Flight Ops — Deployment Guide
## From zero to live on staff phones in ~20 minutes

---

## STEP 1 — Set up Supabase (Free Database)

1. Go to https://supabase.com and click **Start for free**
2. Sign in with GitHub or email
3. Click **New Project** → name it `gia-flight-ops`
4. Choose a region (closest to Gambia: **West EU** or **East US**)
5. Set a database password → click **Create Project** (wait ~2 min)
6. Go to **SQL Editor** → click **New Query**
7. Paste the contents of `supabase-schema.sql` → click **Run**
8. Go to **Settings → API**
9. Copy your **Project URL** and **anon/public key** — you'll need these next

---

## STEP 2 — Deploy to Vercel (Free Hosting)

1. Go to https://github.com and create a new repository called `gia-flight-ops`
2. Upload all the files from this folder to that repository
3. Go to https://vercel.com → Sign in with GitHub
4. Click **Add New Project** → import your `gia-flight-ops` repo
5. Before clicking Deploy, go to **Environment Variables** and add:
   - `REACT_APP_SUPABASE_URL` = your Supabase Project URL
   - `REACT_APP_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click **Deploy** — wait about 2 minutes
7. Your app is now live at: `https://gia-flight-ops.vercel.app`

---

## STEP 3 — Share with Staff (Install on Phones)

### Android phones:
1. Open Chrome on the phone
2. Go to your Vercel URL
3. Tap the 3-dot menu → **Add to Home screen**
4. Tap **Add** — it appears as an app icon ✅

### iPhone:
1. Open Safari on the phone
2. Go to your Vercel URL
3. Tap the **Share** button (box with arrow)
4. Scroll down → tap **Add to Home Screen**
5. Tap **Add** — it appears as an app icon ✅

---

## STEP 4 — Staff Logins

Default PIN for all staff: **1234**

To add more PINs or proper staff accounts, edit the `STAFF_PINS` object
in `src/App.js`, or upgrade to Supabase Auth:
https://supabase.com/docs/guides/auth

---

## STEP 5 — View Submitted Records

All records are stored in your Supabase database.
To view them:
1. Go to https://supabase.com → your project
2. Click **Table Editor** → select `flight_records`
3. You'll see every submission from every staff member

You can also export as CSV from the Table Editor.

---

## Costs
- Supabase Free tier: up to 500MB, 50,000 rows — plenty for daily use
- Vercel Free tier: unlimited deployments, custom domain supported
- **Total cost: $0**

---

## Custom Domain (Optional)
If GIA has a domain (e.g. gambia-airlines.com):
1. In Vercel → your project → Settings → Domains
2. Add `ops.gambia-airlines.com`
3. Follow the DNS instructions Vercel provides

---

## Need Help?
Contact your IT team with this guide or reach out to Vercel/Supabase support.
