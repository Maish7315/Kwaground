-- Drop existing table if exists
DROP TABLE IF EXISTS job_applications;
DROP TABLE IF EXISTS jobs;

-- Create jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  job_title TEXT NOT NULL,
  location TEXT NOT NULL,
  payment_type TEXT NOT NULL,
  payment_amount NUMERIC NOT NULL,
  job_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  description TEXT,
  age_confirmed BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active'
);

-- Create job_applications table
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  job_title TEXT NOT NULL,
  job_location TEXT,
  job_pay TEXT,
  job_type TEXT,
  age TEXT NOT NULL,
  gender TEXT NOT NULL,
  education_level TEXT NOT NULL,
  location TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  parent_guardian_name TEXT NOT NULL,
  brother_sister_name TEXT NOT NULL,
  id_number TEXT NOT NULL,
  policy_agreed BOOLEAN DEFAULT false,
  faithful_honest BOOLEAN DEFAULT false,
  birth_certificate_url TEXT,
  status TEXT DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
CREATE POLICY "Allow public insert on jobs" ON jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on job_applications" ON job_applications FOR INSERT WITH CHECK (true);
