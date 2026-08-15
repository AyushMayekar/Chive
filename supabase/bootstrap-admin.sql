-- First-admin bootstrap (§2.2 / §6.11)
-- This is NOT run automatically and there is no public admin-registration
-- page. Run this once, manually, after creating the user in Supabase Auth.
--
-- Steps:
--   1. Create the user via Supabase Auth (Dashboard > Authentication > Add
--      user, or `supabase auth users create your@email.com` via the CLI, or
--      a one-off sign-up call). Note the user's email.
--   2. Replace 'admin@example.com' below with that exact email.
--   3. Run this file's contents in the Supabase SQL editor (or
--      `supabase db execute -f supabase/bootstrap-admin.sql`).
--   4. Sign in at /admin/login with that account.
--
-- Safe to re-run: it upserts, it does not duplicate rows.

insert into profiles (id, role)
select id, 'admin'
from auth.users
where email = 'ayushmayekardev@gmail.com' -- <-- replace before running
on conflict (id) do update set role = 'admin';
