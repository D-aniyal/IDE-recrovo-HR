CREATE POLICY "Anyone can upload a resume"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can read resumes"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'resumes');