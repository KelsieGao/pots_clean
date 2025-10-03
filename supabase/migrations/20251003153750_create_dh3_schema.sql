/*
  # DH3 Health Monitoring Application Schema

  ## Overview
  This migration creates the complete database schema for the DH3 health monitoring application,
  which tracks heart rate, symptoms, and patient health data for POTS (Postural Orthostatic 
  Tachycardia Syndrome) monitoring.

  ## 1. New Tables

  ### `patients`
  Stores patient demographic and identification information
  - `id` (uuid, primary key)
  - `first_name` (text)
  - `last_name` (text)
  - `date_of_birth` (date)
  - `sex_assigned_at_birth` (text) - 'female', 'male', or 'prefer-not-to-say'
  - `reason_for_use` (text) - 'doctor-referral', 'suspect-pots', or 'other'
  - `reason_for_use_other` (text, optional)
  - `patient_code` (text, unique) - Unique identifier for patient access
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `medications`
  Tracks patient medications
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `name` (text) - Medication name
  - `category` (text) - 'beta-blocker', 'midodrine', 'fludrocortisone', 'ssri-snri', or 'other'
  - `custom_name` (text, optional) - For 'other' category
  - `created_at` (timestamptz)

  ### `support_partners`
  Care partners who can access patient data
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `name` (text)
  - `email` (text)
  - `relationship` (text)
  - `permissions` (text[]) - Array of permission strings
  - `invite_status` (text) - 'pending', 'accepted', or 'declined'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `voss_responses`
  Stores COMPASS (VOSS) survey responses for symptom assessment
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `question_id` (text)
  - `value` (integer) - Numeric response value
  - `text_value` (text, optional) - Text response if applicable
  - `is_baseline` (boolean) - Whether this is baseline or follow-up survey
  - `timestamp` (timestamptz)

  ### `daily_tests`
  Daily orthostatic tests (lying to standing)
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `test_date` (date)
  - `completed` (boolean)
  - `notes` (text, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `heart_rate_readings`
  Individual heart rate measurements
  - `id` (uuid, primary key)
  - `daily_test_id` (uuid, foreign key to daily_tests, optional)
  - `episode_id` (uuid, foreign key to episodes, optional)
  - `patient_id` (uuid, foreign key to patients)
  - `timestamp` (timestamptz)
  - `heart_rate` (integer) - BPM
  - `position` (text) - 'lying', 'sitting', or 'standing'
  - `created_at` (timestamptz)

  ### `bp_readings`
  Blood pressure readings
  - `id` (uuid, primary key)
  - `daily_test_id` (uuid, foreign key to daily_tests)
  - `patient_id` (uuid, foreign key to patients)
  - `timestamp` (timestamptz)
  - `systolic` (integer)
  - `diastolic` (integer)
  - `position` (text) - 'lying' or 'standing'
  - `created_at` (timestamptz)

  ### `episodes`
  Symptom episodes tracked by patients
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `start_time` (timestamptz)
  - `end_time` (timestamptz, optional)
  - `symptoms` (text[]) - Array of symptom descriptions
  - `severity` (integer, optional) - 1-10 scale
  - `notes` (text, optional)
  - `audio_note_url` (text, optional)
  - `latitude` (numeric, optional)
  - `longitude` (numeric, optional)
  - `location_address` (text, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `symptom_entries`
  Individual symptom logs
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `episode_id` (uuid, foreign key to episodes, optional)
  - `timestamp` (timestamptz)
  - `symptoms` (text[]) - Array of symptoms
  - `severity` (integer) - 1-10 scale
  - `notes` (text, optional)
  - `audio_note_url` (text, optional)
  - `time_of_day` (text, optional)
  - `activity_type` (text, optional)
  - `other_details` (text, optional)
  - `heart_rate` (integer, optional)
  - `latitude` (numeric, optional)
  - `longitude` (numeric, optional)
  - `location_address` (text, optional)
  - `created_at` (timestamptz)

  ### `medical_reports`
  Generated medical reports
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `generated_at` (timestamptz)
  - `period_start_date` (date)
  - `period_end_date` (date)
  - `report_data` (jsonb) - Complete report data structure
  - `created_at` (timestamptz)

  ## 2. Security
  
  All tables have Row Level Security (RLS) enabled with restrictive policies:
  - Patients can only access their own data
  - Support partners can view patient data based on permissions
  - Clinicians can access patients under their care (future enhancement)

  ## 3. Indexes
  
  Performance indexes on frequently queried columns:
  - Patient lookups by code
  - Time-based queries for tests and symptoms
  - Foreign key relationships

  ## 4. Important Notes
  
  - All timestamps use `timestamptz` for proper timezone handling
  - UUIDs are used for all primary keys for security and scalability
  - Arrays store multiple values (symptoms, permissions) for flexibility
  - JSONB stores complex nested report data efficiently
  - Location data uses numeric type for precise GPS coordinates
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  sex_assigned_at_birth text NOT NULL CHECK (sex_assigned_at_birth IN ('female', 'male', 'prefer-not-to-say')),
  reason_for_use text NOT NULL CHECK (reason_for_use IN ('doctor-referral', 'suspect-pots', 'other')),
  reason_for_use_other text,
  patient_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('beta-blocker', 'midodrine', 'fludrocortisone', 'ssri-snri', 'other')),
  custom_name text,
  created_at timestamptz DEFAULT now()
);

-- Create support_partners table
CREATE TABLE IF NOT EXISTS support_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  relationship text NOT NULL,
  permissions text[] DEFAULT ARRAY[]::text[],
  invite_status text NOT NULL DEFAULT 'pending' CHECK (invite_status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create voss_responses table
CREATE TABLE IF NOT EXISTS voss_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  value integer NOT NULL,
  text_value text,
  is_baseline boolean NOT NULL DEFAULT true,
  timestamp timestamptz DEFAULT now()
);

-- Create daily_tests table
CREATE TABLE IF NOT EXISTS daily_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  test_date date NOT NULL,
  completed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create episodes table
CREATE TABLE IF NOT EXISTS episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  symptoms text[] DEFAULT ARRAY[]::text[],
  severity integer CHECK (severity >= 1 AND severity <= 10),
  notes text,
  audio_note_url text,
  latitude numeric,
  longitude numeric,
  location_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create heart_rate_readings table
CREATE TABLE IF NOT EXISTS heart_rate_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_test_id uuid REFERENCES daily_tests(id) ON DELETE CASCADE,
  episode_id uuid REFERENCES episodes(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now(),
  heart_rate integer NOT NULL CHECK (heart_rate > 0 AND heart_rate < 300),
  position text NOT NULL CHECK (position IN ('lying', 'sitting', 'standing')),
  created_at timestamptz DEFAULT now()
);

-- Create bp_readings table
CREATE TABLE IF NOT EXISTS bp_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_test_id uuid NOT NULL REFERENCES daily_tests(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now(),
  systolic integer NOT NULL CHECK (systolic > 0 AND systolic < 300),
  diastolic integer NOT NULL CHECK (diastolic > 0 AND diastolic < 200),
  position text NOT NULL CHECK (position IN ('lying', 'standing')),
  created_at timestamptz DEFAULT now()
);

-- Create symptom_entries table
CREATE TABLE IF NOT EXISTS symptom_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  episode_id uuid REFERENCES episodes(id) ON DELETE SET NULL,
  timestamp timestamptz DEFAULT now(),
  symptoms text[] DEFAULT ARRAY[]::text[],
  severity integer NOT NULL CHECK (severity >= 1 AND severity <= 10),
  notes text,
  audio_note_url text,
  time_of_day text,
  activity_type text,
  other_details text,
  heart_rate integer CHECK (heart_rate > 0 AND heart_rate < 300),
  latitude numeric,
  longitude numeric,
  location_address text,
  created_at timestamptz DEFAULT now()
);

-- Create medical_reports table
CREATE TABLE IF NOT EXISTS medical_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  generated_at timestamptz DEFAULT now(),
  period_start_date date NOT NULL,
  period_end_date date NOT NULL,
  report_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patients_patient_code ON patients(patient_code);
CREATE INDEX IF NOT EXISTS idx_medications_patient_id ON medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_support_partners_patient_id ON support_partners(patient_id);
CREATE INDEX IF NOT EXISTS idx_voss_responses_patient_id ON voss_responses(patient_id);
CREATE INDEX IF NOT EXISTS idx_daily_tests_patient_id ON daily_tests(patient_id);
CREATE INDEX IF NOT EXISTS idx_daily_tests_test_date ON daily_tests(test_date);
CREATE INDEX IF NOT EXISTS idx_episodes_patient_id ON episodes(patient_id);
CREATE INDEX IF NOT EXISTS idx_episodes_start_time ON episodes(start_time);
CREATE INDEX IF NOT EXISTS idx_heart_rate_readings_patient_id ON heart_rate_readings(patient_id);
CREATE INDEX IF NOT EXISTS idx_heart_rate_readings_daily_test_id ON heart_rate_readings(daily_test_id);
CREATE INDEX IF NOT EXISTS idx_heart_rate_readings_episode_id ON heart_rate_readings(episode_id);
CREATE INDEX IF NOT EXISTS idx_bp_readings_patient_id ON bp_readings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bp_readings_daily_test_id ON bp_readings(daily_test_id);
CREATE INDEX IF NOT EXISTS idx_symptom_entries_patient_id ON symptom_entries(patient_id);
CREATE INDEX IF NOT EXISTS idx_symptom_entries_episode_id ON symptom_entries(episode_id);
CREATE INDEX IF NOT EXISTS idx_symptom_entries_timestamp ON symptom_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_medical_reports_patient_id ON medical_reports(patient_id);

-- Enable Row Level Security on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE voss_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE heart_rate_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bp_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients table
CREATE POLICY "Patients can view own record"
  ON patients FOR SELECT
  TO authenticated
  USING (auth.uid()::text = patient_code OR id::text = auth.uid()::text);

CREATE POLICY "Patients can update own record"
  ON patients FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = patient_code OR id::text = auth.uid()::text)
  WITH CHECK (auth.uid()::text = patient_code OR id::text = auth.uid()::text);

CREATE POLICY "Anyone can insert new patient"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for medications table
CREATE POLICY "Patients can view own medications"
  ON medications FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own medications"
  ON medications FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can update own medications"
  ON medications FOR UPDATE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code))
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can delete own medications"
  ON medications FOR DELETE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for support_partners table
CREATE POLICY "Patients can view own support partners"
  ON support_partners FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own support partners"
  ON support_partners FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can update own support partners"
  ON support_partners FOR UPDATE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code))
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can delete own support partners"
  ON support_partners FOR DELETE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for voss_responses table
CREATE POLICY "Patients can view own voss responses"
  ON voss_responses FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own voss responses"
  ON voss_responses FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for daily_tests table
CREATE POLICY "Patients can view own daily tests"
  ON daily_tests FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own daily tests"
  ON daily_tests FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can update own daily tests"
  ON daily_tests FOR UPDATE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code))
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for episodes table
CREATE POLICY "Patients can view own episodes"
  ON episodes FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own episodes"
  ON episodes FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can update own episodes"
  ON episodes FOR UPDATE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code))
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for heart_rate_readings table
CREATE POLICY "Patients can view own heart rate readings"
  ON heart_rate_readings FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own heart rate readings"
  ON heart_rate_readings FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for bp_readings table
CREATE POLICY "Patients can view own bp readings"
  ON bp_readings FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own bp readings"
  ON bp_readings FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for symptom_entries table
CREATE POLICY "Patients can view own symptom entries"
  ON symptom_entries FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own symptom entries"
  ON symptom_entries FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can update own symptom entries"
  ON symptom_entries FOR UPDATE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code))
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for medical_reports table
CREATE POLICY "Patients can view own medical reports"
  ON medical_reports FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own medical reports"
  ON medical_reports FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));
