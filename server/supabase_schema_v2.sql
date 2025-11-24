-- Phase 3: Comprehensive Admin Panel Schema Updates

-- 1. Create public.users table to extend auth.users
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  xp integer default 0,
  streak integer default 0,
  last_active timestamp with time zone default timezone('utc'::text, now()),
  banned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Trigger to create public user on auth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Create Categories Table
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  description text,
  icon text, -- URL or icon name
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Create Achievements Table
create table if not exists public.achievements (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  xp_reward integer default 10,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Create User Achievements Table
create table if not exists public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  achievement_id uuid references public.achievements(id) on delete cascade not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, achievement_id)
);

-- 5. Create App Settings Table
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Update Quizzes Table
alter table public.quizzes add column if not exists active boolean default true;

-- 7. Update Questions Table
alter table public.questions add column if not exists explanation text;
alter table public.questions add column if not exists time_limit integer default 60;

-- 8. Enable RLS on new tables
alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.app_settings enable row level security;

-- 9. RLS Policies

-- Users
drop policy if exists "Public profiles are viewable by everyone" on public.users;
create policy "Public profiles are viewable by everyone" on public.users for select using ( true );

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile" on public.users for update using ( auth.uid() = id );

-- Categories
drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone" on public.categories for select using ( true );

drop policy if exists "Admins can insert categories" on public.categories;
create policy "Admins can insert categories" on public.categories for insert with check ( exists (select 1 from public.users where id = auth.uid() and role = 'admin') );

drop policy if exists "Admins can update categories" on public.categories;
create policy "Admins can update categories" on public.categories for update using ( exists (select 1 from public.users where id = auth.uid() and role = 'admin') );

drop policy if exists "Admins can delete categories" on public.categories;
create policy "Admins can delete categories" on public.categories for delete using ( exists (select 1 from public.users where id = auth.uid() and role = 'admin') );

-- Achievements
drop policy if exists "Achievements are viewable by everyone" on public.achievements;
create policy "Achievements are viewable by everyone" on public.achievements for select using ( true );

drop policy if exists "Admins can manage achievements" on public.achievements;
create policy "Admins can manage achievements" on public.achievements for all using ( exists (select 1 from public.users where id = auth.uid() and role = 'admin') );

-- User Achievements
drop policy if exists "User achievements are viewable by everyone" on public.user_achievements;
create policy "User achievements are viewable by everyone" on public.user_achievements for select using ( true );

-- App Settings
drop policy if exists "Settings viewable by everyone" on public.app_settings;
create policy "Settings viewable by everyone" on public.app_settings for select using ( true );

drop policy if exists "Admins can manage settings" on public.app_settings;
create policy "Admins can manage settings" on public.app_settings for all using ( exists (select 1 from public.users where id = auth.uid() and role = 'admin') );

-- Insert default settings
insert into public.app_settings (key, value) values 
('branding', '{"appName": "CloudQuiz", "primaryColor": "#3b82f6"}'::jsonb),
('maintenance', '{"enabled": false, "message": "We are under maintenance."}'::jsonb)
on conflict (key) do nothing;

-- Insert default categories (optional, based on existing quizzes)
insert into public.categories (name, description, icon) values
('Cloud', 'Cloud Computing Fundamentals', 'cloud'),
('Edge', 'Edge Computing and IoT', 'wifi')
on conflict (name) do nothing;
