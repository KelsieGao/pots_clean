# 🏥 POTS Diagnostic App - Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `pots-diagnostic-app`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Start with Free tier
4. Click **"Create new project"** (takes ~2 minutes)

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase_schema_improved.sql` file
3. Paste into SQL Editor and click **"Run"**
4. Verify all tables are created successfully

## Step 3: Get Your Project Credentials

1. Go to **Settings** → **API**
2. Copy these values (you'll need them for iOS app):
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJ...` (starts with eyJ)
   - **service_role key**: `eyJ...` (keep this secret!)

## Step 4: Configure Row Level Security (RLS)

For production, you'll want to set up proper authentication:

1. Go to **Authentication** → **Settings**
2. Configure your preferred auth method (Email, OAuth, etc.)
3. Update RLS policies in SQL Editor to use proper user authentication

## Step 5: Test Your Setup

Run this query in SQL Editor to verify everything works:

```sql
-- Test patient creation
INSERT INTO patients (first_name, last_name, date_of_birth, gender, email)
VALUES ('John', 'Doe', '1985-05-15', 'male', 'john.doe@example.com')
RETURNING id;

-- Test heart rate data insertion
INSERT INTO heartrate_data (patient_id, device_id, recorded_at, heart_rate, contact_status)
SELECT 
    p.id,
    'TEST_DEVICE_001',
    NOW(),
    72,
    true
FROM patients p 
WHERE p.first_name = 'John'
RETURNING id;
```

## Step 6: Set Up Scheduled Jobs (Optional)

For automatic data cleanup and aggregation:

1. Go to **Database** → **Extensions**
2. Enable **pg_cron** extension
3. Set up cron jobs for data processing:

```sql
-- Clean up old data daily at 2 AM
SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_heartrate();');

-- Aggregate hourly data every hour
SELECT cron.schedule('aggregate-hourly-data', '0 * * * *', 'SELECT aggregate_hourly_heartrate();');
```

## Step 7: Configure iOS App Integration

1. Add Supabase Swift client to your iOS project
2. Create configuration file with your credentials
3. Implement data upload functionality

## 🔧 Key Features of This Schema

### Medical Data Management
- **Patient records** with medical history
- **Real-time HR monitoring** with 7-day retention
- **Long-term aggregated data** for trend analysis
- **Orthostatic testing** with POTS-specific calculations
- **Symptom logging** with severity tracking

### POTS-Specific Features
- **Automatic POTS risk scoring** based on HR changes
- **Orthostatic test tracking** with multiple time points
- **VOSS questionnaire** integration
- **Activity classification** using accelerometer data
- **Symptom correlation** with physiological data

### Data Quality & Performance
- **Automatic cleanup** of old raw data
- **Hourly aggregation** for long-term storage
- **Data quality indicators** (signal strength, completeness)
- **Optimized indexes** for fast queries
- **Row Level Security** for patient privacy

## 📊 Sample Queries for Analysis

### Get Patient's Recent HR Trends
```sql
SELECT 
    date_trunc('hour', recorded_at) as hour,
    AVG(heart_rate) as avg_hr,
    MIN(heart_rate) as min_hr,
    MAX(heart_rate) as max_hr,
    COUNT(*) as samples
FROM heartrate_data 
WHERE patient_id = 'your-patient-id'
    AND recorded_at >= NOW() - INTERVAL '24 hours'
GROUP BY date_trunc('hour', recorded_at)
ORDER BY hour;
```

### Analyze POTS Indicators
```sql
SELECT * FROM analyze_pots_indicators('your-patient-id', 7);
```

### Get Orthostatic Test Results
```sql
SELECT 
    test_date,
    supine_hr,
    standing_1min_hr,
    standing_3min_hr,
    hr_increase_3min,
    test_result,
    pots_severity
FROM standup_tests 
WHERE patient_id = 'your-patient-id'
ORDER BY test_date DESC;
```

## 🚨 Important Security Notes

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Set up proper RLS policies** before production
4. **Enable audit logging** for medical data
5. **Regular backups** of patient data
6. **HIPAA compliance** considerations for US medical apps

## 📱 Next Steps

1. Set up your Supabase project
2. Run the schema creation script
3. Test with sample data
4. Integrate with your iOS app
5. Set up proper authentication
6. Deploy to production with security measures

Your POTS diagnostic app will have a robust, medical-grade database backend! 🏥✨
