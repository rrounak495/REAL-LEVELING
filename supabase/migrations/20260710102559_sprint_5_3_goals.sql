-- Sprint 5.3: Add fitness goal to profile for personalized mission generation
ALTER TABLE public.profiles 
ADD COLUMN fitness_goal TEXT NOT NULL DEFAULT 'general_fitness';
