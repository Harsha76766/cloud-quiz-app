-- Script to backfill existing auth.users into public.users table
-- Run this in Supabase SQL Editor to populate the users table

INSERT INTO public.users (id, email, role, xp, streak, last_active, created_at)
SELECT 
    id,
    email,
    'user' as role,  -- Default role for existing users
    0 as xp,
    0 as streak,
    NOW() as last_active,
    created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- Verify the insert
SELECT * FROM public.users;
