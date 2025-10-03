# POTS Diagnostic App 🫀📱

A simplified iOS app for collecting Postural Orthostatic Tachycardia Syndrome (POTS) diagnostic data using Polar BLE heart rate monitors.

## 🎯 Features

- **Heart Rate Collection** - Real-time heart rate monitoring from Polar devices
- **Accelerometer Data** - Movement and positioning data collection
- **Supabase Integration** - Cloud storage for diagnostic data
- **Patient Management** - Create and manage patient records
- **Real-time Upload** - Automatic data streaming to cloud database

## 🚀 Quick Start

### Prerequisites

- Xcode 14+
- iOS 14+
- Polar heart rate monitor (H10, Verity Sense, etc.)
- Supabase account

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KelsieGao/pots_clean.git
   cd pots_clean
   ```

2. **Open in Xcode:**
   ```bash
   open PSDC.xcworkspace
   ```

3. **Set up Supabase:**
   - Update `PSDC/SupabaseConfig.swift` with your Supabase credentials
   - Run the SQL setup script in your Supabase dashboard

4. **Build and run:**
   - Select your device or simulator
   - Build and run the project

## 📱 Usage

1. **Connect Device:** Pair your Polar heart rate monitor
2. **Create Patient:** Set up patient information for data tracking
3. **Start Collection:** Begin heart rate and accelerometer data collection
4. **Automatic Upload:** Data streams to your Supabase database in real-time

## 🗄️ Database Schema

The app creates tables for:
- `patients` - Patient information and demographics
- `heartrate_data` - Real-time heart rate readings
- `accelerometer_data` - Movement and positioning data
- `data_sessions` - Collection sessions

## 📊 Data Collection

- **Heart Rate:** Continuous monitoring with RR intervals
- **Accelerometer:** 3-axis movement data with activity classification
- **Quality Metrics:** Signal quality and contact status
- **Timestamped:** All data includes precise timestamps

## 🔧 Configuration

Update these files for your setup:
- `SupabaseConfig.swift` - Database connection details
- Supabase database schema - Run the SQL setup script

## 📋 Requirements

- **Polar BLE SDK** - Integrated via CocoaPods
- **Supabase Swift Client** - Cloud backend integration
- **RxSwift** - Reactive programming for data streams

## 📈 POTS Diagnostics

This app is specifically designed for POTS (Postural Orthostatic Tachycardia Syndrome) research and diagnosis, providing:

- Heart rate variability analysis
- Position-dependent heart rate changes
- Continuous monitoring during tilt tests
- Cloud data analytics capabilities

## 🛠️ Development

Built with:
- **Swift 5.7**
- **SwiftUI** - Modern iOS interface
- **Combine** - Reactive data handling
- **Core Bluetooth** - BLE device communication

## 📄 License

This project uses the Polar BLE SDK. See the original Polar SDK licensing terms.

## 🤝 Contributing

This is a specialized diagnostic tool. Contributions should focus on data quality, accuracy, and POTS diagnostic features.

---

**Built for POTS research and diagnosis** 🫀📊
