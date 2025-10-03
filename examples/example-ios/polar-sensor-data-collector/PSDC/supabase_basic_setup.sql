-- ============================================
-- BASIC POTS DATABASE SETUP FOR TESTING
-- ============================================

-- ============================================
-- 1. Patient Basic Information Table (Essential Only)
-- ============================================
CREATE TABLE IF NOT EXISTS patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    email TEXT UNIQUE,
    phone TEXT,
    height_cm INTEGER,
    weight_kg DECIMAL(5,2),
    pots_diagnosis_date DATE,
    primary_care_physician TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Heart Rate Data Table
-- ============================================
CREATE TABLE IF NOT EXISTS heartrate_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    heart_rate INTEGER NOT NULL,
    rr_available BOOLEAN NOT NULL,
    rr_interval_ms INTEGER,
    contact_status BOOLEAN,
    contact_status_supported BOOLEAN,
    signal_quality INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. Accelerometer Data Table
-- ============================================
CREATE TABLE IF NOT EXISTS accelerometer_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    x DECIMAL(10,6) NOT NULL,
    y DECIMAL(10,6) NOT NULL,
    z DECIMAL(10,6) NOT NULL,
    magnitude DECIMAL(10,6),
    activity_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. Data Session Management
-- ============================================
CREATE TABLE IF NOT EXISTS data_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    session_type TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_ms INTEGER,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. Create Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_patients_id ON patients(id);
CREATE INDEX IF NOT EXISTS idx_heartrate_patient_time ON heartrate_data(patient_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_accelerometer_patient_time ON accelerometer_data(patient_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_sessions_patient ON data_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON data_sessions(status);

-- ============================================
-- 6. Enable Row Level Security
-- ============================================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE heartrate_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE accelerometer_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. Create Policies (Allow all operations for now)
-- ============================================

-- Patients table policies
CREATE POLICY "Allow all operations on patients" ON patients
    FOR ALL USING (true) WITH CHECK (true);

-- Heart rate data policies
CREATE POLICY "Allow all operations on heartrate_data" ON heartrate_data
    FOR ALL USING (true) WITH CHECK (true);

-- Accelerometer data policies  
CREATE POLICY "Allow all operations on accelerometer_data" ON accelerometer_data
    FOR ALL USING (true) WITH CHECK (true);

-- Data sessions policies
CREATE POLICY "Allow all operations on data_sessions" ON data_sessions
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 8. Test Insert (Optional)
-- ============================================
INSERT INTO patients (first_name, last_name, date_of_birth, gender) 
VALUES ('Test', 'Patient', CURRENT_DATE, 'other') 
ON CONFLICT DO NOTHING;

-- ============================================
-- COMPLETED: Basic POTS Database Setup
-- ============================================
