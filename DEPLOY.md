# Nyumbani Bill – deploy to Vercel

1. Supabase > SQL Editor: run `supabase/demo_bookings.sql` (needs your existing `profiles` table with a `role` column).
2. Supabase > Authentication > Email Templates > Magic Link: paste `supabase/email-otp-template.html`.
3. Upload this whole folder to GitHub (DK-GLOBAL/NYUMBANI-BILL) so that `index.html`, `api/`, `vercel.json` are at the repo ROOT.
4. Vercel > Import the repo. Framework: Other. Build command: none. Output directory: leave empty.
5. Vercel > Settings > Environment Variables (all environments), then Redeploy:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY   (anon/public key only)
6. Supabase > Authentication > URL Configuration: set Site URL to your Vercel/own domain.
7. Optional: put official logos in `assets/partners/` (see README there).

`source/` holds the standalone portal files. The site embeds copies of them inside index.html.
