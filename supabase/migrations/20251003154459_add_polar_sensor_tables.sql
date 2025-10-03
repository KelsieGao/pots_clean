/*
  # Add Polar Sensor Data Collection Tables

  ## Overview
  This migration adds tables specifically for the iOS Polar sensor data collector app,
  enabling real-time heart rate and accelerometer data collection from Polar devices.

  ## 1. New Tables

  ### `heartrate_data`
  Stores heart rate measurements from Polar devices
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `device_id` (text) - Polar device identifier
  - `recorded_at` (timestamptz) - When measurement was taken
  - `heart_rate` (integer) - BPM measurement
  - `rr_available` (boolean) - Whether RR interval data is available
  - `rr_interval_ms` (integer, optional) - RR interval in milliseconds
  - `contact_status` (boolean, optional) - Device contact with skin
  - `contact_status_supported` (boolean, optional) - Device supports contact detection
  - `signal_quality` (integer, optional) - Signal quality indicator
  - `created_at` (timestamptz)

  ### `accelerometer_data`
  Stores accelerometer/movement data from Polar devices
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `device_id` (text) - Polar device identifier
  - `recorded_at` (timestamptz) - When measurement was taken
  - `x` (numeric) - X-axis acceleration
  - `y` (numeric) - Y-axis acceleration
  - `z` (numeric) - Z-axis acceleration
  - `magnitude` (numeric, optional) - Calculated magnitude
  - `activity_type` (text, optional) - Detected activity type
  - `created_at` (timestamptz)

  ### `data_sessions`
  Tracks data collection sessions
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `device_id` (text) - Polar device identifier
  - `session_name` (text, optional)
  - `session_type` (text, optional) - Type of test/session
  - `start_time` (timestamptz)
  - `end_time` (timestamptz, optional)
  - `hr_data_points` (integer, optional) - Count of HR readings
  - `acc_data_points` (integer, optional) - Count of accelerometer readings
  - `data_completeness_percent` (numeric, optional)
  - `notes` (text, optional)
  - `created_at` (timestamptz)

  ### `devices`
  Tracks Polar device information
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `device_id` (text, unique) - Polar device identifier
  - `device_name` (text, optional)
  - `device_type` (text, optional) - e.g., "Polar H10"
  - `battery_level` (integer, optional)
  - `firmware_version` (text, optional)
  - `last_sync` (timestamptz, optional)
  - `is_active` (boolean)
  - `total_recording_hours` (integer, optional)
  - `last_maintenance_date` (timestamptz, optional)
  - `created_at` (timestamptz)

  ### `standup_tests`
  Structured orthostatic tests (lying to standing)
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `test_date` (date)
  - `test_time` (text)
  - Multiple HR and BP measurements at different time points
  - Calculated increases and changes
  - Test results and POTS severity assessment
  - Environmental factors (temperature, meal timing, medications)

  ### `symptom_logs`
  Detailed symptom logging during tests
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `logged_at` (timestamptz)
  - `symptom_type` (text)
  - `severity` (integer) - 1-10 scale
  - `duration_minutes` (integer, optional)
  - `position` (text, optional)
  - `trigger_factors` (text[], optional)
  - HR and BP during symptom
  - `notes` (text, optional)

  ### `voss_questionnaires`
  VOSS/COMPASS questionnaire responses
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key to patients)
  - `completed_at` (timestamptz)
  - Various symptom frequency and severity scores
  - `total_score` (integer, optional)
  - `interpretation` (text, optional)

  ## 2. Security
  
  All tables have RLS enabled with policies allowing:
  - Patients to access their own data
  - Public insert for initial setup (to be restricted after auth implementation)

  ## 3. Indexes
  
  Performance indexes on:
  - Patient lookups
  - Device lookups
  - Time-based queries for data collection
  - Session tracking

  ## 4. Important Notes
  
  - High-frequency sensor data (heart rate, accelerometer) uses batch uploads
  - Device IDs from Polar devices are stored as text
  - RR interval data is critical for heart rate variability analysis
  - Sessions track data collection periods for better organization
*/

-- Create heartrate_data table
CREATE TABLE IF NOT EXISTS heartrate_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  recorded_at timestamptz NOT NULL,
  heart_rate integer NOT NULL CHECK (heart_rate > 0 AND heart_rate < 300),
  rr_available boolean DEFAULT false,
  rr_interval_ms integer CHECK (rr_interval_ms > 0),
  contact_status boolean,
  contact_status_supported boolean,
  signal_quality integer CHECK (signal_quality >= 0 AND signal_quality <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create accelerometer_data table
CREATE TABLE IF NOT EXISTS accelerometer_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  recorded_at timestamptz NOT NULL,
  x numeric NOT NULL,
  y numeric NOT NULL,
  z numeric NOT NULL,
  magnitude numeric,
  activity_type text,
  created_at timestamptz DEFAULT now()
);

-- Create data_sessions table
CREATE TABLE IF NOT EXISTS data_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  session_name text,
  session_type text,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  hr_data_points integer DEFAULT 0,
  acc_data_points integer DEFAULT 0,
  data_completeness_percent numeric CHECK (data_completeness_percent >= 0 AND data_completeness_percent <= 100),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  device_id text UNIQUE NOT NULL,
  device_name text,
  device_type text,
  battery_level integer CHECK (battery_level >= 0 AND battery_level <= 100),
  firmware_version text,
  last_sync timestamptz,
  is_active boolean DEFAULT true,
  total_recording_hours integer DEFAULT 0,
  last_maintenance_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create standup_tests table
CREATE TABLE IF NOT EXISTS standup_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  test_date date NOT NULL,
  test_time text NOT NULL,
  supine_hr integer CHECK (supine_hr > 0 AND supine_hr < 300),
  supine_systolic integer CHECK (supine_systolic > 0 AND supine_systolic < 300),
  supine_diastolic integer CHECK (supine_diastolic > 0 AND supine_diastolic < 200),
  supine_duration_minutes integer,
  standing_1min_hr integer CHECK (standing_1min_hr > 0 AND standing_1min_hr < 300),
  standing_1min_systolic integer CHECK (standing_1min_systolic > 0 AND standing_1min_systolic < 300),
  standing_1min_diastolic integer CHECK (standing_1min_diastolic > 0 AND standing_1min_diastolic < 200),
  standing_3min_hr integer CHECK (standing_3min_hr > 0 AND standing_3min_hr < 300),
  standing_3min_systolic integer CHECK (standing_3min_systolic > 0 AND standing_3min_systolic < 300),
  standing_3min_diastolic integer CHECK (standing_3min_diastolic > 0 AND standing_3min_diastolic < 200),
  standing_5min_hr integer CHECK (standing_5min_hr > 0 AND standing_5min_hr < 300),
  standing_10min_hr integer CHECK (standing_10min_hr > 0 AND standing_10min_hr < 300),
  hr_increase_1min integer,
  hr_increase_3min integer,
  hr_increase_5min integer,
  hr_increase_10min integer,
  systolic_drop_1min integer,
  systolic_drop_3min integer,
  test_result text,
  pots_severity text,
  notes text,
  room_temperature numeric,
  time_since_last_meal integer,
  medications_taken text,
  created_at timestamptz DEFAULT now()
);

-- Create symptom_logs table
CREATE TABLE IF NOT EXISTS symptom_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  logged_at timestamptz NOT NULL,
  symptom_type text NOT NULL,
  severity integer NOT NULL CHECK (severity >= 1 AND severity <= 10),
  duration_minutes integer,
  position text,
  trigger_factors text[],
  hr_during_symptom integer CHECK (hr_during_symptom > 0 AND hr_during_symptom < 300),
  bp_during_symptom_systolic integer CHECK (bp_during_symptom_systolic > 0 AND bp_during_symptom_systolic < 300),
  bp_during_symptom_diastolic integer CHECK (bp_during_symptom_diastolic > 0 AND bp_during_symptom_diastolic < 200),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create voss_questionnaires table
CREATE TABLE IF NOT EXISTS voss_questionnaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL,
  symptom_frequency integer CHECK (symptom_frequency >= 0 AND symptom_frequency <= 10),
  symptom_severity integer CHECK (symptom_severity >= 0 AND symptom_severity <= 10),
  dizziness_frequency integer CHECK (dizziness_frequency >= 0 AND dizziness_frequency <= 10),
  fatigue_level integer CHECK (fatigue_level >= 0 AND fatigue_level <= 10),
  orthostatic_intolerance integer CHECK (orthostatic_intolerance >= 0 AND orthostatic_intolerance <= 10),
  cognitive_symptoms integer CHECK (cognitive_symptoms >= 0 AND cognitive_symptoms <= 10),
  sleep_quality integer CHECK (sleep_quality >= 0 AND sleep_quality <= 10),
  total_score integer,
  interpretation text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for sensor data performance
CREATE INDEX IF NOT EXISTS idx_heartrate_data_patient_id ON heartrate_data(patient_id);
CREATE INDEX IF NOT EXISTS idx_heartrate_data_device_id ON heartrate_data(device_id);
CREATE INDEX IF NOT EXISTS idx_heartrate_data_recorded_at ON heartrate_data(recorded_at);
CREATE INDEX IF NOT EXISTS idx_accelerometer_data_patient_id ON accelerometer_data(patient_id);
CREATE INDEX IF NOT EXISTS idx_accelerometer_data_device_id ON accelerometer_data(device_id);
CREATE INDEX IF NOT EXISTS idx_accelerometer_data_recorded_at ON accelerometer_data(recorded_at);
CREATE INDEX IF NOT EXISTS idx_data_sessions_patient_id ON data_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_data_sessions_device_id ON data_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_data_sessions_start_time ON data_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_devices_patient_id ON devices(patient_id);
CREATE INDEX IF NOT EXISTS idx_devices_device_id ON devices(device_id);
CREATE INDEX IF NOT EXISTS idx_standup_tests_patient_id ON standup_tests(patient_id);
CREATE INDEX IF NOT EXISTS idx_standup_tests_test_date ON standup_tests(test_date);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_patient_id ON symptom_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_symptom_logs_logged_at ON symptom_logs(logged_at);
CREATE INDEX IF NOT EXISTS idx_voss_questionnaires_patient_id ON voss_questionnaires(patient_id);

-- Enable Row Level Security
ALTER TABLE heartrate_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE accelerometer_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE standup_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE voss_questionnaires ENABLE ROW LEVEL SECURITY;

-- RLS Policies for heartrate_data
CREATE POLICY "Patients can view own heart rate data"
  ON heartrate_data FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own heart rate data"
  ON heartrate_data FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for accelerometer_data
CREATE POLICY "Patients can view own accelerometer data"
  ON accelerometer_data FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own accelerometer data"
  ON accelerometer_data FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for data_sessions
CREATE POLICY "Patients can view own data sessions"
  ON data_sessions FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own data sessions"
  ON data_sessions FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can update own data sessions"
  ON data_sessions FOR UPDATE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code))
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for devices
CREATE POLICY "Patients can view own devices"
  ON devices FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own devices"
  ON devices FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can update own devices"
  ON devices FOR UPDATE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code))
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for standup_tests
CREATE POLICY "Patients can view own standup tests"
  ON standup_tests FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own standup tests"
  ON standup_tests FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can update own standup tests"
  ON standup_tests FOR UPDATE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code))
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for symptom_logs
CREATE POLICY "Patients can view own symptom logs"
  ON symptom_logs FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own symptom logs"
  ON symptom_logs FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can update own symptom logs"
  ON symptom_logs FOR UPDATE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code))
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

-- RLS Policies for voss_questionnaires
CREATE POLICY "Patients can view own voss questionnaires"
  ON voss_questionnaires FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));

CREATE POLICY "Patients can insert own voss questionnaires"
  ON voss_questionnaires FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth.uid()::text = patient_code));
