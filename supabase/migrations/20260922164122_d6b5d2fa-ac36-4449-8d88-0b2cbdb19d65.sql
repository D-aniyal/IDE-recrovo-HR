CREATE TABLE public.candidate_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT,
  problem_title TEXT NOT NULL DEFAULT 'Problem 03: Distributed Rate Limiter',
  message TEXT,
  resume_path TEXT,
  resume_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.candidate_submissions TO anon;
GRANT SELECT, INSERT ON public.candidate_submissions TO authenticated;
GRANT ALL ON public.candidate_submissions TO service_role;

ALTER TABLE public.candidate_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a submission"
  ON public.candidate_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view submissions"
  ON public.candidate_submissions FOR SELECT TO anon, authenticated
  USING (true);