import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://ezujitcsjhsmuyhynavy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6dWppdGNzamhzbXV5aHluYXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzU1MzYsImV4cCI6MjA4NjY1MTUzNn0.rHLsWrBKxfMVj0uyISSvP8tGsWOxpK0WXY9tfp94eAk';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for database tables
export interface Job {
  id: string;
  created_at: string;
  job_title: string;
  location: string;
  payment_type: string;
  payment_amount: number;
  job_type: string;
  start_date: string;
  end_date: string | null;
  start_time: string;
  end_time: string;
  phone_number: string;
  description: string | null;
  age_confirmed: boolean;
  status: string;
}

export interface JobApplication {
  id: string;
  created_at: string;
  job_title: string;
  job_location: string | null;
  job_pay: string | null;
  job_type: string | null;
  full_name: string;
  age: string;
  gender: string;
  education_level: string;
  location: string;
  phone_number: string;
  parent_guardian_name: string;
  brother_sister_name: string;
  has_id: boolean;
  id_number: string | null;
  id_card_url: string | null;
  has_birth_certificate: boolean;
  birth_certificate_url: string | null;
  is_kenyan: boolean;
  country: string | null;
  policy_agreed: boolean;
  faithful_honest: boolean;
  status: string;
}
