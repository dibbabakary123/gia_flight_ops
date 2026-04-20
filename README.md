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
