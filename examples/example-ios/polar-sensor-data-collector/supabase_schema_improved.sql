-- ============================================
-- IMPROVED POTS DIAGNOSTIC DATABASE SCHEMA
-- ============================================

-- ============================================
-- 1. Patient Basic Information Table (Enhanced)
-- ============================================
CREATE TABLE patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    email TEXT UNIQUE,
    phone TEXT,
    -- Medical information
    height_cm INTEGER,
    weight_kg DECIMAL(5,2),
    -- POTS specific
    pots_diagnosis_date DATE,
    primary_care_physician TEXT,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Real-time Heart Rate Data (Keep 7 days only)
-- ============================================
CREATE TABLE heartrate_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    heart_rate INTEGER NOT NULL CHECK (heart_rate > 0 AND heart_rate < 300),
    rr_available BOOLEAN DEFAULT FALSE,
    rr_interval_ms INTEGER, -- Store actual RR interval
    contact_status BOOLEAN,
    contact_status_supported BOOLEAN,
    -- Data quality indicators
    signal_quality INTEGER CHECK (signal_quality BETWEEN 1 AND 5), -- 1=poor, 5=excellent
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_heartrate_patient_time ON heartrate_data(patient_id, recorded_at DESC);
CREATE INDEX idx_heartrate_cleanup ON heartrate_data(recorded_at); -- For cleanup function

-- ============================================
-- 3. Hourly Heart Rate Summary (Long-term storage)
-- ============================================
CREATE TABLE heartrate_hourly_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    hour_timestamp TIMESTAMPTZ NOT NULL,
    avg_hr DOUBLE PRECISION,
    min_hr INTEGER,
    max_hr INTEGER,
    sample_count INTEGER,
    -- Additional metrics for POTS analysis
    hr_variability DOUBLE PRECISION, -- Heart rate variability
    resting_hr DOUBLE PRECISION, -- Estimated resting HR
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(patient_id, hour_timestamp)
);

CREATE INDEX idx_hr_hourly_patient ON heartrate_hourly_summary(patient_id, hour_timestamp DESC);

-- ============================================
-- 4. Accelerometer Data Table (Enhanced)
-- ============================================
CREATE TABLE accelerometer_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    x DOUBLE PRECISION NOT NULL,
    y DOUBLE PRECISION NOT NULL,
    z DOUBLE PRECISION NOT NULL,
    -- Calculated metrics
    magnitude DOUBLE PRECISION GENERATED ALWAYS AS (SQRT(x*x + y*y + z*z)) STORED,
    -- Activity classification
    activity_type TEXT CHECK (activity_type IN ('resting', 'sitting', 'standing', 'walking', 'unknown')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_acc_patient_time ON accelerometer_data(patient_id, recorded_at DESC);
CREATE INDEX idx_acc_activity ON accelerometer_data(patient_id, activity_type, recorded_at DESC);

-- ============================================
-- 5. Stand-Up Test Table (Orthostatic Test) - Enhanced
-- ============================================
CREATE TABLE standup_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    test_date DATE NOT NULL,
    test_time TIME NOT NULL,
    
    -- Supine position (lying down)
    supine_hr INTEGER CHECK (supine_hr > 0 AND supine_hr < 300),
    supine_systolic INTEGER CHECK (supine_systolic > 0 AND supine_systolic < 300),
    supine_diastolic INTEGER CHECK (supine_diastolic > 0 AND supine_diastolic < 200),
    supine_duration_minutes INTEGER DEFAULT 5, -- How long patient was supine
    
    -- Standing positions
    standing_1min_hr INTEGER CHECK (standing_1min_hr > 0 AND standing_1min_hr < 300),
    standing_1min_systolic INTEGER CHECK (standing_1min_systolic > 0 AND standing_1min_systolic < 300),
    standing_1min_diastolic INTEGER CHECK (standing_1min_diastolic > 0 AND standing_1min_diastolic < 200),
    
    standing_3min_hr INTEGER CHECK (standing_3min_hr > 0 AND standing_3min_hr < 300),
    standing_3min_systolic INTEGER CHECK (standing_3min_systolic > 0 AND standing_3min_systolic < 300),
    standing_3min_diastolic INTEGER CHECK (standing_3min_diastolic > 0 AND standing_3min_diastolic < 200),
    
    -- Additional standing measurements
    standing_5min_hr INTEGER CHECK (standing_5min_hr > 0 AND standing_5min_hr < 300),
    standing_10min_hr INTEGER CHECK (standing_10min_hr > 0 AND standing_10min_hr < 300),
    
    -- Calculated values
    hr_increase_1min INTEGER GENERATED ALWAYS AS (standing_1min_hr - supine_hr) STORED,
    hr_increase_3min INTEGER GENERATED ALWAYS AS (standing_3min_hr - supine_hr) STORED,
    hr_increase_5min INTEGER GENERATED ALWAYS AS (standing_5min_hr - supine_hr) STORED,
    hr_increase_10min INTEGER GENERATED ALWAYS AS (standing_10min_hr - supine_hr) STORED,
    
    systolic_drop_1min INTEGER GENERATED ALWAYS AS (supine_systolic - standing_1min_systolic) STORED,
    systolic_drop_3min INTEGER GENERATED ALWAYS AS (supine_systolic - standing_3min_systolic) STORED,
    
    -- Test results and notes
    test_result TEXT CHECK (test_result IN ('normal', 'orthostatic_hypotension', 'pots', 'inconclusive')),
    pots_severity TEXT CHECK (pots_severity IN ('mild', 'moderate', 'severe')) DEFAULT NULL,
    notes TEXT,
    
    -- Test conditions
    room_temperature DECIMAL(4,1), -- Celsius
    time_since_last_meal INTEGER, -- minutes
    medications_taken TEXT, -- List of medications taken before test
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_standup_patient_date ON standup_tests(patient_id, test_date DESC);

-- ============================================
-- 6. Symptom Log Table (Enhanced)
-- ============================================
CREATE TABLE symptom_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    logged_at TIMESTAMPTZ NOT NULL,
    
    symptom_type TEXT NOT NULL CHECK (symptom_type IN (
        'dizziness', 'lightheadedness', 'fainting', 'near_fainting',
        'palpitations', 'chest_pain', 'shortness_of_breath',
        'fatigue', 'brain_fog', 'nausea', 'headache', 'sweating',
        'tremor', 'anxiety', 'other'
    )),
    severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 10),
    duration_minutes INTEGER,
    position TEXT CHECK (position IN ('lying', 'sitting', 'standing', 'walking')),
    -- Trigger factors
    trigger_factors TEXT[], -- Array of trigger factors
    -- Associated measurements
    hr_during_symptom INTEGER,
    bp_during_symptom_systolic INTEGER,
    bp_during_symptom_diastolic INTEGER,
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_symptoms_patient_time ON symptom_logs(patient_id, logged_at DESC);
CREATE INDEX idx_symptoms_type ON symptom_logs(patient_id, symptom_type, logged_at DESC);

-- ============================================
-- 7. VOSS Questionnaire Table (Enhanced)
-- ============================================
CREATE TABLE voss_questionnaires (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ NOT NULL,
    
    -- VOSS specific questions (adjust based on actual questionnaire)
    symptom_frequency INTEGER CHECK (symptom_frequency BETWEEN 0 AND 4),
    symptom_severity INTEGER CHECK (symptom_severity BETWEEN 0 AND 4),
    dizziness_frequency INTEGER CHECK (dizziness_frequency BETWEEN 0 AND 4),
    fatigue_level INTEGER CHECK (fatigue_level BETWEEN 0 AND 10),
    -- Additional VOSS questions
    orthostatic_intolerance INTEGER CHECK (orthostatic_intolerance BETWEEN 0 AND 4),
    cognitive_symptoms INTEGER CHECK (cognitive_symptoms BETWEEN 0 AND 4),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 0 AND 10),
    
    total_score INTEGER,
    interpretation TEXT, -- Automated interpretation of score
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_voss_patient_date ON voss_questionnaires(patient_id, completed_at DESC);

-- ============================================
-- 8. Device Management Table (Enhanced)
-- ============================================
CREATE TABLE devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    device_id TEXT UNIQUE NOT NULL,
    device_name TEXT,
    device_type TEXT CHECK (device_type IN ('polar_h10', 'polar_verity_sense', 'polar_ignite', 'other')),
    -- Device status
    battery_level INTEGER CHECK (battery_level BETWEEN 0 AND 100),
    firmware_version TEXT,
    last_sync TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    -- Usage statistics
    total_recording_hours INTEGER DEFAULT 0,
    last_maintenance_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. Data Collection Sessions Table (NEW)
-- ============================================
CREATE TABLE data_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    session_name TEXT,
    session_type TEXT CHECK (session_type IN ('continuous_monitoring', 'orthostatic_test', 'exercise_test', 'sleep_study')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    -- Data quality metrics
    hr_data_points INTEGER DEFAULT 0,
    acc_data_points INTEGER DEFAULT 0,
    data_completeness_percent DECIMAL(5,2), -- Percentage of expected data points received
    -- Session metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_patient ON data_sessions(patient_id, start_time DESC);

-- ============================================
-- 10. Enhanced Cleanup and Aggregation Functions
-- ============================================

-- Clean up heart rate data older than 7 days
CREATE OR REPLACE FUNCTION cleanup_old_heartrate()
RETURNS void AS $$
BEGIN
    DELETE FROM heartrate_data 
    WHERE recorded_at < NOW() - INTERVAL '7 days';
    
    -- Log cleanup activity
    INSERT INTO system_logs (action, details) 
    VALUES ('cleanup_heartrate', 'Cleaned up heart rate data older than 7 days');
END;
$$ LANGUAGE plpgsql;

-- Aggregate hourly heart rate data with enhanced metrics
CREATE OR REPLACE FUNCTION aggregate_hourly_heartrate()
RETURNS void AS $$
BEGIN
    INSERT INTO heartrate_hourly_summary (patient_id, hour_timestamp, avg_hr, min_hr, max_hr, sample_count, hr_variability)
    SELECT 
        patient_id,
        date_trunc('hour', recorded_at) as hour_timestamp,
        AVG(heart_rate) as avg_hr,
        MIN(heart_rate) as min_hr,
        MAX(heart_rate) as max_hr,
        COUNT(*) as sample_count,
        STDDEV(heart_rate) as hr_variability
    FROM heartrate_data
    WHERE recorded_at >= NOW() - INTERVAL '2 hours'
    GROUP BY patient_id, date_trunc('hour', recorded_at)
    ON CONFLICT (patient_id, hour_timestamp) 
    DO UPDATE SET
        avg_hr = EXCLUDED.avg_hr,
        min_hr = EXCLUDED.min_hr,
        max_hr = EXCLUDED.max_hr,
        sample_count = EXCLUDED.sample_count,
        hr_variability = EXCLUDED.hr_variability;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 11. POTS Analysis Functions
-- ============================================

-- Function to analyze recent HR data for POTS indicators
CREATE OR REPLACE FUNCTION analyze_pots_indicators(patient_uuid UUID, days_back INTEGER DEFAULT 7)
RETURNS TABLE (
    avg_hr_lying DOUBLE PRECISION,
    avg_hr_standing DOUBLE PRECISION,
    hr_increase_standing DOUBLE PRECISION,
    hr_variability DOUBLE PRECISION,
    pots_risk_score DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(AVG(CASE WHEN acc.activity_type = 'lying' THEN hr.heart_rate END), 0) as avg_hr_lying,
        COALESCE(AVG(CASE WHEN acc.activity_type = 'standing' THEN hr.heart_rate END), 0) as avg_hr_standing,
        COALESCE(AVG(CASE WHEN acc.activity_type = 'standing' THEN hr.heart_rate END), 0) - 
        COALESCE(AVG(CASE WHEN acc.activity_type = 'lying' THEN hr.heart_rate END), 0) as hr_increase_standing,
        STDDEV(hr.heart_rate) as hr_variability,
        -- Simple POTS risk score (0-100)
        LEAST(100, GREATEST(0, 
            (COALESCE(AVG(CASE WHEN acc.activity_type = 'standing' THEN hr.heart_rate END), 0) - 
             COALESCE(AVG(CASE WHEN acc.activity_type = 'lying' THEN hr.heart_rate END), 0)) * 0.5 +
            STDDEV(hr.heart_rate) * 0.3
        )) as pots_risk_score
    FROM heartrate_data hr
    LEFT JOIN accelerometer_data acc ON hr.patient_id = acc.patient_id 
        AND ABS(EXTRACT(EPOCH FROM (hr.recorded_at - acc.recorded_at))) < 5 -- Within 5 seconds
    WHERE hr.patient_id = patient_uuid
        AND hr.recorded_at >= NOW() - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 12. System Logs Table
-- ============================================
CREATE TABLE system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. Row Level Security (RLS) - Enhanced
-- ============================================

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE heartrate_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE heartrate_hourly_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE accelerometer_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE standup_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE voss_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sessions ENABLE ROW LEVEL SECURITY;

-- Production-ready RLS policies (replace testing policies)
-- Example: Patients can only see their own data
CREATE POLICY "Patients can view own data" ON patients FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Patients can update own data" ON patients FOR UPDATE USING (auth.uid()::text = id::text);

-- For now, keep testing policies for development
CREATE POLICY "Allow all for testing" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for testing" ON heartrate_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for testing" ON heartrate_hourly_summary FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for testing" ON accelerometer_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for testing" ON standup_tests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for testing" ON symptom_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for testing" ON voss_questionnaires FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for testing" ON devices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for testing" ON data_sessions FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 14. Scheduled Jobs for Data Processing
-- ============================================

-- Create a function to run scheduled tasks
CREATE OR REPLACE FUNCTION run_scheduled_tasks()
RETURNS void AS $$
BEGIN
    -- Clean up old heart rate data
    PERFORM cleanup_old_heartrate();
    
    -- Aggregate hourly summaries
    PERFORM aggregate_hourly_heartrate();
    
    -- Log the scheduled run
    INSERT INTO system_logs (action, details) 
    VALUES ('scheduled_tasks', 'Completed scheduled data processing tasks');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 15. Insert Test Patient with Enhanced Data
-- ============================================

INSERT INTO patients (first_name, last_name, date_of_birth, gender, email, height_cm, weight_kg)
VALUES ('Test', 'Patient', '1990-01-01', 'male', 'test@example.com', 175, 70.0);

-- Insert test device
INSERT INTO devices (patient_id, device_id, device_name, device_type, battery_level, firmware_version)
SELECT 
    p.id,
    'TEST_DEVICE_001',
    'Polar H10 Test',
    'polar_h10',
    85,
    '2.1.0'
FROM patients p 
WHERE p.first_name = 'Test' AND p.last_name = 'Patient';
