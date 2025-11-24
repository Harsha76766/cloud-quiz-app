-- Add sample quiz results for leaderboard testing
-- Make sure you have users and quizzes in your database first

-- Insert sample results (adjust user_id and quiz_id to match your actual data)
INSERT INTO public.results (user_id, quiz_id, score, completed_at) VALUES
  ((SELECT id FROM public.users LIMIT 1), (SELECT id FROM public.quizzes LIMIT 1), 95, NOW() - INTERVAL '1 day'),
  ((SELECT id FROM public.users LIMIT 1), (SELECT id FROM public.quizzes LIMIT 1), 88, NOW() - INTERVAL '2 days'),
  ((SELECT id FROM public.users LIMIT 1), (SELECT id FROM public.quizzes LIMIT 1), 92, NOW() - INTERVAL '3 days'),
  ((SELECT id FROM public.users LIMIT 1), (SELECT id FROM public.quizzes LIMIT 1), 78, NOW() - INTERVAL '4 days'),
  ((SELECT id FROM public.users LIMIT 1), (SELECT id FROM public.quizzes LIMIT 1), 85, NOW() - INTERVAL '5 days'),
  ((SELECT id FROM public.users LIMIT 1), (SELECT id FROM public.quizzes LIMIT 1), 97, NOW() - INTERVAL '6 days'),
  ((SELECT id FROM public.users LIMIT 1), (SELECT id FROM public.quizzes LIMIT 1), 72, NOW() - INTERVAL '7 days'),
  ((SELECT id FROM public.users LIMIT 1), (SELECT id FROM public.quizzes LIMIT 1), 89, NOW() - INTERVAL '8 days'),
  ((SELECT id FROM public.users LIMIT 1), (SELECT id FROM public.quizzes LIMIT 1), 100, NOW() - INTERVAL '9 days'),
  ((SELECT id FROM public.users LIMIT 1), (SELECT id FROM public.quizzes LIMIT 1), 81, NOW() - INTERVAL '10 days');

-- Verify the data
SELECT * FROM public.results ORDER BY score DESC LIMIT 10;
