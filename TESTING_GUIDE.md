# Testing Guide: Polar Sensor Data Collector

This guide will help you test the iOS Polar sensor data collector app to ensure it's properly connected to Supabase and collecting data.

## Prerequisites

### Hardware Requirements
- **iOS Device** (iPhone or iPad with iOS 13+)
- **Polar Heart Rate Monitor** (e.g., Polar H10, H9, or OH1)
  - Must be a Polar device with Bluetooth connectivity
  - Fully charged
  - Properly fitted (chest strap or arm band)

### Software Requirements
- **Xcode** installed on Mac
- **CocoaPods** installed (`sudo gem install cocoapods`)
- iOS device connected via USB or wireless debugging

## Setup Steps

### 1. Install Dependencies

```bash
cd examples/example-ios/polar-sensor-data-collector
pod install
```

### 2. Open Project in Xcode

```bash
open PSDC.xcworkspace
```

**Important:** Always open the `.xcworkspace` file, NOT the `.xcodeproj` file.

### 3. Configure Signing

1. In Xcode, select the project in the navigator
2. Select the "PSDC" target
3. Go to "Signing & Capabilities"
4. Select your development team
5. Xcode will automatically generate a bundle identifier

### 4. Build and Run

1. Select your iOS device from the device menu
2. Click the Run button (▶️) or press `Cmd + R`
3. On first run, trust the developer certificate on your iOS device:
   - Settings → General → VPN & Device Management → Trust

## Testing the Sensor Collector

### Test 1: Verify Supabase Connection

**What to test:** Database connectivity

**Steps:**
1. Launch the app
2. Check the console output in Xcode for:
   ```
   ✅ Supabase connection test successful!
   ```
3. If you see an error, verify:
   - Internet connection on device
   - Supabase credentials in `SupabaseConfig.swift`

**Expected Result:** Connection indicator shows green/connected

---

### Test 2: Patient Setup

**What to test:** Patient registration in database

**Steps:**
1. In the app, tap "Setup New Patient"
2. Enter patient information:
   - First Name: Test
   - Last Name: Patient
   - Date of Birth: Select a date
   - Patient Code: (will be auto-generated)
3. Tap "Save"

**Expected Result:**
- Patient created successfully
- Patient code displayed
- Data saved to Supabase `patients` table

**Verify in Database:**
```sql
SELECT * FROM patients ORDER BY created_at DESC LIMIT 1;
```

---

### Test 3: Connect Polar Device

**What to test:** Bluetooth connection to Polar sensor

**Steps:**
1. Turn on your Polar device (wet the electrodes if chest strap)
2. In the app, tap "Connect Device"
3. Wait for device scan
4. Select your Polar device from the list (e.g., "Polar H10 12345678")
5. Tap "Connect"

**Expected Result:**
- Device shows as "Connected"
- Green status indicator
- Battery level displayed (if supported)

**Troubleshooting:**
- Ensure Bluetooth is enabled on iPhone
- Polar device is within range (2-3 meters)
- Device is not paired in iPhone Settings (unpair if needed)
- Electrodes are wet (for chest strap)

---

### Test 4: Heart Rate Streaming

**What to test:** Real-time heart rate data collection

**Steps:**
1. With device connected, tap "Start Heart Rate Streaming"
2. Observe the heart rate display updating in real-time
3. Let it run for at least 1-2 minutes
4. Tap "Stop Streaming"

**Expected Result:**
- Heart rate updates every 1 second
- Values are realistic (60-200 BPM)
- Data is being uploaded to Supabase

**Verify in Database:**
```sql
SELECT COUNT(*) as total_readings,
       MIN(heart_rate) as min_hr,
       MAX(heart_rate) as max_hr,
       AVG(heart_rate) as avg_hr
FROM heartrate_data
WHERE patient_id = 'YOUR_PATIENT_ID'
  AND recorded_at > NOW() - INTERVAL '5 minutes';
```

---

### Test 5: Stand-Up Test

**What to test:** Complete orthostatic test (lying to standing)

**Steps:**
1. Lie down comfortably for 5 minutes with device connected
2. In the app, tap "Start Stand-Up Test"
3. Follow the on-screen prompts:
   - Record supine (lying) heart rate for 2 minutes
   - Stand up when prompted
   - Record standing heart rate for 3 minutes
4. Enter blood pressure readings if prompted
5. Complete the test

**Expected Result:**
- Test completes successfully
- Heart rate increase calculated (standing HR - supine HR)
- Test results saved to database
- POTS indicators displayed if HR increase > 30 BPM

**Verify in Database:**
```sql
SELECT * FROM standup_tests
WHERE patient_id = 'YOUR_PATIENT_ID'
ORDER BY test_date DESC LIMIT 1;
```

---

### Test 6: Accelerometer Data

**What to test:** Movement/activity tracking

**Steps:**
1. With device connected, tap "Start Accelerometer"
2. Move around, walk, sit, stand
3. Let it run for 1-2 minutes
4. Tap "Stop Accelerometer"

**Expected Result:**
- X, Y, Z values displayed
- Activity type detected (if supported by device)
- Data uploaded to Supabase

**Verify in Database:**
```sql
SELECT COUNT(*) as readings,
       AVG(magnitude) as avg_magnitude
FROM accelerometer_data
WHERE patient_id = 'YOUR_PATIENT_ID'
  AND recorded_at > NOW() - INTERVAL '5 minutes';
```

---

### Test 7: Data Session Tracking

**What to test:** Session management

**Steps:**
1. Start a new session with a name (e.g., "Morning Test")
2. Record heart rate for 2-3 minutes
3. End the session
4. View session summary

**Expected Result:**
- Session created with start/end times
- Data point counts displayed
- Session saved to database

**Verify in Database:**
```sql
SELECT s.session_name, s.start_time, s.end_time,
       s.hr_data_points, s.acc_data_points
FROM data_sessions s
WHERE s.patient_id = 'YOUR_PATIENT_ID'
ORDER BY s.start_time DESC LIMIT 1;
```

---

## Viewing Data in the Web Dashboard

After collecting data with the iOS app, you can view it in the web dashboard:

1. Open the web app in your browser
2. Log in with your patient code
3. Navigate to the dashboard
4. View your daily tests, heart rate trends, and episodes

## Troubleshooting

### Issue: "Supabase connection failed"
**Solution:**
- Check internet connectivity
- Verify credentials in `SupabaseConfig.swift`
- Ensure RLS policies allow access

### Issue: "Polar device not found"
**Solution:**
- Enable Bluetooth on iPhone
- Turn Polar device on/off
- Wet electrodes (chest strap)
- Move device closer to phone
- Unpair from iPhone Bluetooth settings

### Issue: "Heart rate shows 0 or ---"
**Solution:**
- Ensure proper skin contact
- Wet electrodes thoroughly
- Tighten chest strap
- Wait 10-15 seconds for signal

### Issue: "Data not appearing in database"
**Solution:**
- Check Xcode console for errors
- Verify patient ID is set
- Check RLS policies in Supabase
- Ensure authenticated user has access

### Issue: "Upload queue not processing"
**Solution:**
- Check internet connection
- Review error messages in console
- Verify Supabase credentials
- Check database table permissions

## Console Logs to Monitor

Watch for these key messages in Xcode console:

**Good Signs:**
```
✅ Supabase connection test successful!
✅ Device connected: Polar H10 12345678
✅ Heart rate data uploaded successfully
✅ Session created: Morning Test
```

**Warning Signs:**
```
❌ Supabase connection test failed
⚠️ Device disconnected
⚠️ Failed to upload data: [error message]
```

## Database Verification Queries

Use these queries in Supabase SQL editor to verify data:

```sql
-- Check all tables have data
SELECT 'patients' as table_name, COUNT(*) FROM patients
UNION ALL
SELECT 'heartrate_data', COUNT(*) FROM heartrate_data
UNION ALL
SELECT 'accelerometer_data', COUNT(*) FROM accelerometer_data
UNION ALL
SELECT 'data_sessions', COUNT(*) FROM data_sessions
UNION ALL
SELECT 'standup_tests', COUNT(*) FROM standup_tests;

-- Check recent heart rate data
SELECT recorded_at, heart_rate, device_id
FROM heartrate_data
ORDER BY recorded_at DESC
LIMIT 20;

-- Check data upload rate
SELECT DATE_TRUNC('minute', recorded_at) as minute,
       COUNT(*) as readings_per_minute
FROM heartrate_data
WHERE recorded_at > NOW() - INTERVAL '1 hour'
GROUP BY minute
ORDER BY minute DESC;
```

## Performance Benchmarks

**Expected Performance:**
- Heart rate sampling: 1 Hz (once per second)
- Accelerometer sampling: 25-200 Hz (device dependent)
- Upload latency: < 2 seconds per batch
- Batch size: 100 readings
- Connection time: < 5 seconds

## Next Steps

Once testing is complete:
1. Test with multiple patients
2. Run extended sessions (30+ minutes)
3. Test edge cases (low battery, lost connection)
4. Verify data integrity in web dashboard
5. Test symptom logging integration
6. Generate and review medical reports
