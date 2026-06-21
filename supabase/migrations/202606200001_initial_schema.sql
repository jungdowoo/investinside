create extension if not exists "pgcrypto";

create table if not exists public.investors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  display_name text not null,
  investor_name text not null,
  firm_name text not null,
  cik text not null check (cik ~ '^\d{10}$'),
  description text,
  style text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.filings (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references public.investors(id) on delete cascade,
  accession_number text unique not null,
  form_type text not null check (form_type in ('13F-HR', '13F-HR/A')),
  filing_date date not null,
  report_date date not null,
  sec_url text not null,
  information_table_url text,
  raw_submission jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.holdings (
  id uuid primary key default gen_random_uuid(),
  filing_id uuid not null references public.filings(id) on delete cascade,
  investor_id uuid not null references public.investors(id) on delete cascade,
  report_date date not null,
  issuer_name text not null,
  title_of_class text,
  cusip text not null,
  ticker text,
  value_usd bigint not null default 0 check (value_usd >= 0),
  shares numeric not null default 0 check (shares >= 0),
  share_type text,
  put_call text,
  investment_discretion text,
  voting_sole numeric,
  voting_shared numeric,
  voting_none numeric,
  portfolio_weight numeric not null default 0,
  created_at timestamptz not null default now()
);

do $$
begin
  create type public.holding_change_type as enum ('NEW', 'EXIT', 'INCREASE', 'DECREASE', 'UNCHANGED');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.holding_changes (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references public.investors(id) on delete cascade,
  current_filing_id uuid not null references public.filings(id) on delete cascade,
  previous_filing_id uuid references public.filings(id) on delete set null,
  ticker text,
  cusip text not null,
  issuer_name text not null,
  change_type public.holding_change_type not null,
  previous_shares numeric not null default 0,
  current_shares numeric not null default 0,
  share_change numeric not null default 0,
  share_change_percent numeric,
  previous_value_usd bigint not null default 0,
  current_value_usd bigint not null default 0,
  value_change_usd bigint not null default 0,
  report_date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.stock_aliases (
  id uuid primary key default gen_random_uuid(),
  cusip text unique not null,
  ticker text,
  issuer_name text,
  normalized_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.learn_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  content text not null,
  category text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists holdings_investor_id_idx on public.holdings(investor_id);
create index if not exists holdings_filing_id_idx on public.holdings(filing_id);
create index if not exists holdings_report_date_idx on public.holdings(report_date desc);
create index if not exists holdings_cusip_idx on public.holdings(cusip);
create index if not exists holdings_ticker_idx on public.holdings(ticker) where ticker is not null;
create index if not exists filings_investor_report_idx on public.filings(investor_id, report_date desc);
create index if not exists holding_changes_filing_idx on public.holding_changes(current_filing_id);
create index if not exists holding_changes_type_idx on public.holding_changes(change_type);
create index if not exists admin_logs_created_idx on public.admin_logs(created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists investors_set_updated_at on public.investors;
create trigger investors_set_updated_at before update on public.investors for each row execute function public.set_updated_at();
drop trigger if exists learn_posts_set_updated_at on public.learn_posts;
create trigger learn_posts_set_updated_at before update on public.learn_posts for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.investors enable row level security;
alter table public.filings enable row level security;
alter table public.holdings enable row level security;
alter table public.holding_changes enable row level security;
alter table public.stock_aliases enable row level security;
alter table public.learn_posts enable row level security;
alter table public.admin_logs enable row level security;
alter table public.admin_users enable row level security;

create policy "Public reads active investors" on public.investors for select using (is_active or public.is_admin());
create policy "Public reads filings" on public.filings for select using (true);
create policy "Public reads holdings" on public.holdings for select using (true);
create policy "Public reads changes" on public.holding_changes for select using (true);
create policy "Public reads aliases" on public.stock_aliases for select using (true);
create policy "Public reads published posts" on public.learn_posts for select using (published or public.is_admin());
create policy "Admins read logs" on public.admin_logs for select using (public.is_admin());
create policy "Admins read own role" on public.admin_users for select using (user_id = auth.uid());

create policy "Admins insert investors" on public.investors for insert with check (public.is_admin());
create policy "Admins update investors" on public.investors for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete investors" on public.investors for delete using (public.is_admin());
create policy "Admins manage aliases" on public.stock_aliases for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage posts" on public.learn_posts for all using (public.is_admin()) with check (public.is_admin());

-- 프로젝트 생성 시 "Automatically expose new tables"를 꺼도 필요한 읽기만 허용한다.
grant usage on schema public to anon, authenticated;
grant select on public.investors to anon, authenticated;
grant select on public.filings to anon, authenticated;
grant select on public.holdings to anon, authenticated;
grant select on public.holding_changes to anon, authenticated;
grant select on public.stock_aliases to anon, authenticated;
grant select on public.learn_posts to anon, authenticated;
grant select on public.admin_users to authenticated;

-- Secret key는 service_role로 서버 수집과 관리자 작업을 수행한다.
grant usage on schema public to service_role;
grant all privileges on all tables in schema public to service_role;
alter default privileges in schema public grant all privileges on tables to service_role;

insert into public.investors (id, slug, display_name, investor_name, firm_name, cik, description, style, is_active)
values (
  '00000000-0000-0000-0000-000000000001',
  'warren-buffett-berkshire-hathaway',
  'Warren Buffett',
  'Warren Buffett',
  'BERKSHIRE HATHAWAY INC',
  '0001067983',
  'Warren Buffett과 관련된 BERKSHIRE HATHAWAY INC의 SEC Form 13F 공시를 기준으로 정리합니다. 개인 계좌 전체를 의미하지 않습니다.',
  '장기 가치투자로 알려진 운용사',
  true
)
on conflict (slug) do nothing;

-- 추가 예정(SEC에서 기관명과 CIK를 직접 검증한 뒤 관리자 화면에서 등록):
-- Ray Dalio / Bridgewater Associates, LP
-- Michael Burry / Scion Asset Management, LLC
-- Bill Ackman / Pershing Square Capital Management, L.P.
-- Stanley Druckenmiller / Duquesne Family Office LLC
-- David Tepper / Appaloosa LP
