-- Grant permissions for Journey tables to ensure clients can fetch data
GRANT ALL ON TABLE public.user_journeys TO authenticated, service_role, anon;
GRANT ALL ON TABLE public.user_journey_days TO authenticated, service_role, anon;
