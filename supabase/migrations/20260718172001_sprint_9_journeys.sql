-- Create user_journeys table
CREATE TABLE IF NOT EXISTS public.user_journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active',
    goal TEXT NOT NULL,
    journey_type TEXT,
    class_path TEXT,
    duration_days INTEGER NOT NULL,
    current_day INTEGER NOT NULL DEFAULT 1,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_journey_days table
CREATE TABLE IF NOT EXISTS public.user_journey_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES public.user_journeys(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    day_type TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    story_text TEXT,
    chapter_number INTEGER,
    mission_ids TEXT[],
    boss_id UUID,
    objective TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies for user_journeys
ALTER TABLE public.user_journeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own journeys"
    ON public.user_journeys FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journeys"
    ON public.user_journeys FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journeys"
    ON public.user_journeys FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journeys"
    ON public.user_journeys FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for user_journey_days
ALTER TABLE public.user_journey_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their journey days"
    ON public.user_journey_days FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_journeys 
            WHERE user_journeys.id = user_journey_days.journey_id 
            AND user_journeys.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their journey days"
    ON public.user_journey_days FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_journeys 
            WHERE user_journeys.id = user_journey_days.journey_id 
            AND user_journeys.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their journey days"
    ON public.user_journey_days FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_journeys 
            WHERE user_journeys.id = user_journey_days.journey_id 
            AND user_journeys.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their journey days"
    ON public.user_journey_days FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_journeys 
            WHERE user_journeys.id = user_journey_days.journey_id 
            AND user_journeys.user_id = auth.uid()
        )
    );

-- Create updated_at trigger for user_journeys
CREATE TRIGGER handle_updated_at_user_journeys
    BEFORE UPDATE ON public.user_journeys
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
