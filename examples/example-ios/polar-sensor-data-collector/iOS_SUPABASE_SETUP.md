# 📱 iOS Supabase Integration Setup

## Step 1: Add Supabase Swift Client to Your Project

### Using Swift Package Manager (Recommended)

1. In Xcode, go to **File** → **Add Package Dependencies**
2. Enter this URL: `https://github.com/supabase/supabase-swift`
3. Click **Add Package**
4. Select **Supabase** and click **Add Package**

### Alternative: Using CocoaPods

Add this to your `Podfile`:
```ruby
pod 'Supabase'
```

Then run:
```bash
pod install
```

## Step 2: Configure Your Supabase Credentials

1. Open `PSDC/Config/SupabaseConfig.swift`
2. Replace the placeholder values:
   ```swift
   static let url = "https://your-actual-project-id.supabase.co"
   static let anonKey = "your-actual-anon-key-here"
   ```

### How to get your credentials:
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** and **anon public** key

## Step 3: Update Your Project File

Add the new files to your Xcode project:
- `SupabaseModels.swift`
- `SupabaseManager.swift`
- `SupabaseConfig.swift`

## Step 4: Test the Integration

Add this test code to your app's initialization:

```swift
// In your App.swift or main view
func testSupabaseConnection() {
    Task {
        do {
            let supabase = SupabaseManager.shared
            print("Supabase connection status: \(supabase.isConnected)")
        } catch {
            print("Supabase test failed: \(error)")
        }
    }
}
```

## Step 5: Set Up Patient Management

Add a simple patient setup in your app:

```swift
// Create a test patient
func createTestPatient() async {
    let patient = Patient(
        id: UUID(),
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: Date(),
        gender: "male",
        email: "john.doe@example.com",
        phone: nil,
        heightCm: 175,
        weightKg: 70.0,
        potsDiagnosisDate: nil,
        primaryCarePhysician: nil,
        createdAt: Date(),
        updatedAt: Date()
    )
    
    do {
        let createdPatient = try await SupabaseManager.shared.createPatient(patient)
        print("Created patient: \(createdPatient.id)")
        
        // Set as current patient for data collection
        PolarBleSdkManager().setCurrentPatient(createdPatient.id)
    } catch {
        print("Failed to create patient: \(error)")
    }
}
```

## Step 6: Start Data Collection Session

```swift
// Start a monitoring session
func startMonitoring() {
    let manager = PolarBleSdkManager()
    manager.startDataSession(
        sessionName: "Daily Monitoring",
        sessionType: "continuous_monitoring"
    )
    
    // Your existing HR and ACC streaming code will now automatically upload to Supabase
}
```

## 🔧 Key Features Now Available

### Automatic Data Upload
- Heart rate data is automatically uploaded when streaming
- Accelerometer data is automatically uploaded with activity classification
- Data is queued and uploaded in batches for efficiency

### Patient Management
- Create and manage patient profiles
- Track multiple patients
- Associate data with specific patients

### Session Tracking
- Track data collection sessions
- Monitor data completeness
- End sessions with summary statistics

### Real-time Sync
- Optional real-time data synchronization
- Live updates across multiple devices
- Offline data queuing

## 📊 Data Flow

```
Polar Device → iOS App → Supabase Database
     ↓              ↓           ↓
  HR/ACC Data → Local Storage → Cloud Storage
     ↓              ↓           ↓
 Real-time → Batch Upload → Medical Analysis
```

## 🚨 Important Security Notes

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Set up proper RLS policies** in Supabase
4. **Enable audit logging** for medical data
5. **Regular backups** of patient data

## 🔍 Troubleshooting

### Common Issues:

1. **Connection Failed**
   - Check your Supabase URL and API key
   - Verify internet connectivity
   - Check Supabase project status

2. **Upload Errors**
   - Verify RLS policies allow data insertion
   - Check data format matches database schema
   - Monitor Supabase logs for errors

3. **Missing Data**
   - Ensure patient ID is set before starting sessions
   - Check device connection status
   - Verify streaming is active

## 📈 Next Steps

1. Set up your Supabase project
2. Run the database schema
3. Add Supabase to your iOS project
4. Configure credentials
5. Test with sample data
6. Implement patient management UI
7. Add data visualization features

Your POTS diagnostic app now has a complete cloud backend! 🏥✨
