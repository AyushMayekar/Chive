-- Chive Admin V1 schema
-- Run via: supabase db push  (or paste into the Supabase SQL editor)
-- Idempotent: safe to re-run.

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists pgcrypto; -- gen_random_uuid()

-- ============================================================
-- CONVERSATIONS (base table — create if this is a fresh project;
-- existing columns match lib/types.ts exactly)
-- ============================================================
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  conversation_id text unique not null,
  title text not null,
  summary text not null,
  publisher_name text,
  publisher_email text,
  share_url text not null,
  llm text not null,
  category text not null,
  submission_date date not null default current_date,
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Admin-only fields (§6.1)
alter table conversations add column if not exists reviewed_by uuid;
alter table conversations add column if not exists reviewed_at timestamptz;
alter table conversations add column if not exists rejection_reason text;
alter table conversations add column if not exists featured boolean not null default false;

-- updated_at auto-bump
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_conversations_updated_at on conversations;
create trigger trg_conversations_updated_at
  before update on conversations
  for each row execute function set_updated_at();

-- ============================================================
-- conversation_id generation — server-side, collision-safe (§2.6)
-- ============================================================
create or replace function generate_conversation_id()
returns text language plpgsql as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  candidate text;
  i int;
  exists_already boolean;
begin
  loop
    candidate := 'CHV-';
    for i in 1..7 loop
      candidate := candidate || substr(alphabet, floor(random() * length(alphabet) + 1)::int, 1);
    end loop;
    select exists(select 1 from conversations where conversation_id = candidate) into exists_already;
    exit when not exists_already;
  end loop;
  return candidate;
end;
$$;

create or replace function set_conversation_id()
returns trigger language plpgsql as $$
begin
  if new.conversation_id is null then
    new.conversation_id := generate_conversation_id();
  end if;
  -- Public inserts must never set status themselves — always start Pending.
  -- (Admin mutations use UPDATE, not INSERT, so this only affects inserts.)
  new.status := 'Pending';
  new.reviewed_by := null;
  new.reviewed_at := null;
  new.rejection_reason := null;
  new.featured := false;
  return new;
end;
$$;

drop trigger if exists trg_conversations_set_id on conversations;
create trigger trg_conversations_set_id
  before insert on conversations
  for each row execute function set_conversation_id();

-- ============================================================
-- PROFILES (admin role model, §2.2/§6.2)
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'none' check (role in ('none', 'admin', 'reviewer', 'super_admin')),
  created_at timestamptz not null default now()
);
-- Note: default role is 'none' — no default grants admin access. A row must be
-- explicitly upserted with role = 'admin' via the bootstrap script (see
-- supabase/bootstrap-admin.sql). 'reviewer'/'super_admin' are reserved for future use.

-- ============================================================
-- CATEGORIES / LLMS (§6.3, §6.4)
-- ============================================================
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  slug text not null unique,
  active boolean not null default true,
  sort_order int not null default 0
);

create table if not exists llms (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  slug text not null unique,
  active boolean not null default true,
  sort_order int not null default 0
);

-- Seed from the project's existing CATEGORY_OPTIONS / LLM_OPTIONS (§6.9)
insert into categories (label, slug, sort_order) values
  ('Programming', 'programming', 1),
  ('Research', 'research', 2),
  ('Education', 'education', 3),
  ('Business', 'business', 4),
  ('AI & ML', 'ai-ml', 5),
  ('Career', 'career', 6),
  ('Productivity', 'productivity', 7),
  ('Writing', 'writing', 8),
  ('Other', 'other', 9)
on conflict (slug) do nothing;

insert into llms (label, slug, sort_order) values
  ('ChatGPT', 'chatgpt', 1),
  ('Claude', 'claude', 2),
  ('Gemini', 'gemini', 3),
  ('Perplexity', 'perplexity', 4),
  ('DeepSeek', 'deepseek', 5)
on conflict (slug) do nothing;

-- ============================================================
-- SITE_SETTINGS (§6.5)
-- ============================================================
create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references profiles(id)
);

insert into site_settings (key, value) values
  ('hero', '{}'::jsonb),
  ('about', '{}'::jsonb),
  ('how_it_works', '{}'::jsonb),
  ('footer', '{}'::jsonb),
  ('contact', '{}'::jsonb),
  ('logo', '{}'::jsonb),
  ('publishing_guidelines', '{}'::jsonb),
  ('review_sla_text', '{}'::jsonb),
  ('announcement', '{}'::jsonb)
on conflict (key) do nothing;

drop trigger if exists trg_site_settings_updated_at on site_settings;
create trigger trg_site_settings_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

-- ============================================================
-- AUDIT_LOGS (§6.6) — written only via the service-role client
-- ============================================================
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- RLS
-- ============================================================
alter table conversations enable row level security;
alter table profiles enable row level security;
alter table categories enable row level security;
alter table llms enable row level security;
alter table site_settings enable row level security;
alter table audit_logs enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- conversations -----------------------------------------------------------
drop policy if exists conversations_public_select on conversations;
create policy conversations_public_select on conversations
  for select using (status = 'Approved' or is_admin());

drop policy if exists conversations_public_insert on conversations;
create policy conversations_public_insert on conversations
  for insert with check (
    -- status/conversation_id/reviewed_*/featured are forced by the trigger
    -- above regardless of what the client sends; this policy just allows
    -- the insert to happen at all for anonymous/public role.
    true
  );

drop policy if exists conversations_admin_update on conversations;
create policy conversations_admin_update on conversations
  for update using (is_admin()) with check (is_admin());

drop policy if exists conversations_admin_delete on conversations;
create policy conversations_admin_delete on conversations
  for delete using (is_admin() and status = 'Rejected');

-- profiles ------------------------------------------------------------------
drop policy if exists profiles_select_own on profiles;
create policy profiles_select_own on profiles
  for select using (auth.uid() = id or is_admin());
-- No insert/update/delete policy for any browser-reachable role — the only
-- writer is the bootstrap script (run with the service role key or via the
-- SQL editor), by design (§2.2/§6.2).

-- categories / llms -----------------------------------------------------
drop policy if exists categories_public_select on categories;
create policy categories_public_select on categories
  for select using (active = true or is_admin());

drop policy if exists categories_admin_write on categories;
create policy categories_admin_write on categories
  for all using (is_admin()) with check (is_admin());

drop policy if exists llms_public_select on llms;
create policy llms_public_select on llms
  for select using (active = true or is_admin());

drop policy if exists llms_admin_write on llms;
create policy llms_admin_write on llms
  for all using (is_admin()) with check (is_admin());

-- site_settings -----------------------------------------------------------
drop policy if exists site_settings_public_select on site_settings;
create policy site_settings_public_select on site_settings
  for select using (true);

drop policy if exists site_settings_admin_write on site_settings;
create policy site_settings_admin_write on site_settings
  for update using (is_admin()) with check (is_admin());

-- audit_logs ----------------------------------------------------------------
drop policy if exists audit_logs_admin_select on audit_logs;
create policy audit_logs_admin_select on audit_logs
  for select using (is_admin());
-- No insert/update/delete policy for any browser-reachable role. Rows are
-- written exclusively by the service-role client from Server Actions
-- (lib/admin/audit.ts), which bypasses RLS entirely.
