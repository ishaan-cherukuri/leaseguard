-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  stripe_customer_id text,
  subscription_status text default 'free', -- 'free' | 'active' | 'canceled' | 'past_due'
  subscription_id text,
  plan text default 'free',               -- 'free' | 'shield' | 'guard' | 'sentinel'
  free_analyses_used integer default 0,   -- used by shield (one-time) and legacy free tier
  docs_used_this_month integer default 0, -- used by free/guard/sentinel (resets monthly)
  docs_reset_at timestamptz default now(), -- when docs_used_this_month was last reset
  created_at timestamptz default now()
);

-- Analyses table
create table public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  document_type text, -- 'lease' | 'gym' | 'car' | 'employment' | 'other'
  status text default 'processing', -- 'processing' | 'complete' | 'failed'
  risk_score integer, -- 0-100
  risk_level text, -- 'low' | 'medium' | 'high' | 'critical'
  summary text,
  total_cost_estimate text,
  flagged_clauses jsonb default '[]',
  negotiation_points jsonb default '[]',
  market_comparison text,
  payment_type text, -- 'subscription' | 'one_time' | 'free_trial'
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Row level security
alter table public.profiles enable row level security;
alter table public.analyses enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can read own analyses" on public.analyses for select using (auth.uid() = user_id);
create policy "Users can insert own analyses" on public.analyses for insert with check (auth.uid() = user_id);

-- Allow service role to update analyses (used by API route)
create policy "Service role can update analyses" on public.analyses for update using (true);

-- Allow service role to read profiles (used by API route)
create policy "Service role can read profiles" on public.profiles for select using (true);

-- Allow service role to update profiles (used by API route)
create policy "Service role can update profiles" on public.profiles for update using (true);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage policies for contracts bucket
create policy "Authenticated users can upload contracts"
on storage.objects for insert
to authenticated
with check (bucket_id = 'contracts');

create policy "Users can read own contracts"
on storage.objects for select
to authenticated
using (bucket_id = 'contracts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Service role full storage access"
on storage.objects
to service_role
using (true)
with check (true);
