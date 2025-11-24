-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (handled by Supabase Auth)

-- Quizzes Table
create table public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text not null,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Questions Table
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question_text text not null,
  options jsonb not null, 
  correct_answer text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Results Table
create table public.results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  score integer not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.results enable row level security;

create policy "Public quizzes are viewable by everyone" on public.quizzes for select using ( true );
create policy "Public questions are viewable by everyone" on public.questions for select using ( true );
create policy "Users can insert their own results" on public.results for insert with check ( auth.uid() = user_id );
create policy "Users can view their own results" on public.results for select using ( auth.uid() = user_id );

-- Insert sample data
insert into public.quizzes (title, description, category, difficulty)
values
('Cloud Computing Basics', 'Test your knowledge on Cloud fundamentals.', 'Cloud', 'Easy'),
('Edge Computing 101', 'Understand the basics of Edge Computing.', 'Edge', 'Medium');
