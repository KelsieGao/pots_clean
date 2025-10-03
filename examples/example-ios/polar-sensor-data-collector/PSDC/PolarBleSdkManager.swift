/// Copyright © 2021 Polar Electro Oy. All rights reserved.

import Foundation
import PolarBleSdk
import RxSwift
import CoreBluetooth

enum OnlineStreamingState {
    case inProgress
    case success(url: URL?)
    case failed(error: Error)
}

struct OnlineStreamingFeature {
    var isSupported: Bool = false
    var availableOnlineDataTypes: [PolarDeviceDataType: Bool] = [:]
    var isStreaming: [PolarDeviceDataType: OnlineStreamingState] = [:]
}

struct RecordingSettings: Identifiable {
    let id = UUID()
    let feature: PolarDeviceDataType
    let settings: PolarSensorSetting
}

/// Simplified PolarBleSdkManager for HR and ACC data collection only
class PolarBleSdkManager : ObservableObject {
    
    static let shared = PolarBleSdkManager()
    
    private var api = PolarBleApiDefaultImpl.polarImplementation(DispatchQueue.main,
                                                                 features: [PolarBleSdkFeature.feature_hr,
                                                                            PolarBleSdkFeature.feature_battery_info,
                                                                            PolarBleSdkFeature.feature_device_info,
                                                                            PolarBleSdkFeature.feature_polar_online_streaming]
    )
    
    // Supabase integration
    private let supabaseManager = SupabaseManager.shared
    var currentPatientId: UUID?
    private var currentSessionId: UUID?
    
    var connectedDevices: [(PolarDeviceInfo, Disposable?)] = []
    var disconnectedDevicesPairingErrors: [String: Bool] = [:]
    var connectedDevicesText = ""
    
    @Published var isBluetoothOn: Bool
    @Published var deviceConnectionState: DeviceConnectionState = DeviceConnectionState.noDevice(nullPolarDeviceInfo)
    @Published var deviceSearch: DeviceSearch = DeviceSearch()
    @Published var switchableDevices: [PolarDeviceInfo] = []
    @Published var onlineStreamingFeature: OnlineStreamingFeature = OnlineStreamingFeature()
    @Published var onlineStreamSettings: RecordingSettings? = nil
    @Published var onlineRecordingDataTypes: [PolarDeviceDataType] = []
    @Published var deviceInfoFeature: DeviceInfoFeature = DeviceInfoFeature()
    @Published var batteryStatusFeature: BatteryStatusFeature = BatteryStatusFeature()
    @Published var generalMessage: Message? = nil
    @Published var hrRecordingData: HrRecordingFeature = HrRecordingFeature()
    @Published var accRecordingData: AccRecordingFeature = AccRecordingFeature()
    @Published var deviceConnected: Bool = false
    
    private var onlineStreamingDisposables: [PolarDeviceDataType: Disposable?] = [:]
    private let disposeBag = DisposeBag()
    
    var deviceId: String? {
        if case .connected(let device) = deviceConnectionState {
            return device.deviceId
        }
        return nil
    }
    
    init() {
        self.isBluetoothOn = api.isBlePowered
        
        api.polarFilter(true)
        api.observer = self
        api.deviceFeaturesObserver = self
        api.powerStateObserver = self
        api.deviceInfoObserver = self
        api.logger = self
    }
    
    func updateSelectedDevice(device : PolarDeviceInfo) {
        if case .disconnected = deviceConnectionState {
            self.deviceConnectionState = DeviceConnectionState.disconnected(device)
        }
        
        if case .connected = deviceConnectionState {
            let device = self.deviceConnectionState.get()
            self.disconnectFromDevice(device: device)
        }
        
        if case .noDevice = deviceConnectionState {
            self.deviceConnectionState = DeviceConnectionState.noDevice(device)
        }
        
        if case .connecting = deviceConnectionState {
            self.deviceConnectionState = DeviceConnectionState.connecting(device)
        }
    }
    
    func connectToDevice(withId deviceId : String) {
        do {
            for connectedDevice in connectedDevices {
                if (connectedDevice.0.deviceId == deviceId) {
                    return
                }
            }
            try api.connectToDevice(deviceId)
        } catch let err {
            NSLog("Failed to connect to \(deviceId). Reason \(err)")
        }
    }
    
    private func updateStateWhenDeviceConnected(device : PolarDeviceInfo) {
        connectedDevices.insert((device, nil), at:0)
        self.deviceConnectionState = DeviceConnectionState.connected(device)
        self.updateDisplayedConnectedDevices(with: device)
    }
    
    func disconnectFromDevice(device : PolarDeviceInfo) {
        do {
            guard connectedDevices.contains(where: { $0.0.deviceId == deviceId }) else {
                NSLog("Not connected to \(device.deviceId), ignoring disconnect")
                return
            }
            guard deviceConnectionState.get().deviceId == device.deviceId else {
                NSLog("Not connected to \(device.deviceId), ignoring disconnect")
                return
            }
            NSLog("disconnectFromDevice \(device.deviceId)")
            try api.disconnectFromDevice(device.deviceId)
        } catch let err {
            NSLog("Failed to disconnect from \(device.deviceId). Reason \(err)")
        }
    }
    
    private func updateStateWhenDeviceDisconnected(withId deviceId : String, pairingError: Bool) {
        if let index = connectedDevices.firstIndex(where: { $0.0.deviceId == deviceId }) {
            print("dispose timer")
            connectedDevices[index].1?.dispose()
            connectedDevices.remove(at: index)
            disconnectedDevicesPairingErrors[deviceId] = pairingError
        }
        
        if pairingError && generalMessage == nil {
            Task { @MainActor in
                self.generalMessage = Message(text: "Pairing error for \(deviceId). Remove previous Bluetooth pairing from phone and from sensor/watch to enable pairing again, restart app, and retry connecting.")
            }
        }
        updateDisplayedConnectedDevices()
    }
    
    private func updateDisplayedConnectedDevices(with device: PolarDeviceInfo? = nil) {
        if (connectedDevices.isEmpty) {
            connectedDevicesText = "No device connected"
            deviceConnectionState = DeviceConnectionState.noDevice(nullPolarDeviceInfo)
        } else {
            let selectedDevice = (connectedDevices.first(where: { $0.0.deviceId == device?.deviceId }) ?? connectedDevices.first!).0
            connectedDevicesText = "Connected: \(selectedDevice.name)"
            deviceConnectionState = DeviceConnectionState.connected(selectedDevice)
        }
        
        self.switchableDevices = self.connectedDevices.compactMap { (device, disposable) in
            return device.deviceId != self.deviceId ? device : nil
        }
    }
    
    // MARK: - Online Streaming Functions
    
    func isStreamOn(feature: PolarDeviceDataType) -> Bool {
        if case .inProgress = onlineStreamingFeature.isStreaming[feature] {
                return true
        }
        return false
    }
    
    func onlineStreamStart(feature: PolarDeviceDataType) {
        guard let deviceId = deviceId else { return }
        
        if feature == .hr {
            startHrStreaming(deviceId: deviceId)
        } else if feature == .acc {
            getOnlineStreamSettings(feature: feature)
        }
    }
    
    func onlineStreamStop(feature: PolarDeviceDataType) {
        onlineStreamingDisposables[feature]??.dispose()
        onlineStreamingDisposables[feature] = nil
        
        Task { @MainActor in
            self.onlineStreamingFeature.isStreaming[feature] = OnlineStreamingState.success(url: nil)
        }
    }
    
    func getOnlineStreamSettings(feature: PolarDeviceDataType) {
        guard let deviceId = deviceId else { return }
        
        _ = api.requestStreamSettings(deviceId, feature: feature)
                    .observe(on: MainScheduler.instance)
            .subscribe { [weak self] event in
                        switch event {
                case .success(let settings):
                    self?.onlineStreamSettings = RecordingSettings(feature: feature, settings: settings)
                        case .failure(let error):
                    print("Failed to get stream settings: \(error)")
                }
            }
            .disposed(by: disposeBag)
    }

    private func startHrStreaming(deviceId: String) {
        onlineStreamingDisposables[.hr] = api.startHrStreaming(deviceId)
                    .observe(on: MainScheduler.instance)
                    .subscribe { [weak self] event in
                        switch event {
                case .next(let hrData):
            Task { @MainActor in
                        self?.hrRecordingData.hr = hrData[0].hr
                        self?.hrRecordingData.rrs = hrData[0].rrsMs.first ?? 0
                        self?.hrRecordingData.rrAvailable = !hrData[0].rrsMs.isEmpty
                        self?.hrRecordingData.contactStatus = hrData[0].contactStatus
                        self?.hrRecordingData.contactStatusSupported = hrData[0].contactStatusSupported
                        
                        // Upload to Supabase
                        if let hrSample = hrData.first {
                            self?.uploadHeartRateData(hrSample)
                        }
                    }
                    case .completed:
                        Task { @MainActor in
                        self?.onlineStreamingFeature.isStreaming[.hr] = OnlineStreamingState.success(url: nil)
                    }
                case .error(let error):
                    print("HR streaming error: \(error)")
            Task { @MainActor in
                        self?.onlineStreamingFeature.isStreaming[.hr] = OnlineStreamingState.failed(error: error)
                    }
                }
            }
        
                            Task { @MainActor in
            self.onlineStreamingFeature.isStreaming[.hr] = OnlineStreamingState.inProgress
        }
    }
    
    func startAccStreaming(deviceId: String, settings: PolarSensorSetting) {
        let disposable = api.startAccStreaming(deviceId, settings: settings)
                .observe(on: MainScheduler.instance)
            .subscribe(onNext: { [weak self] accData in
                        Task { @MainActor in
                    if let sample = accData.first {
                        let (timeStamp, x, y, z) = sample
                        self?.accRecordingData.x = x
                        self?.accRecordingData.y = y
                        self?.accRecordingData.z = z
                        self?.accRecordingData.timestamp = timeStamp
                        
                        // Upload to Supabase
                        self?.uploadAccelerometerData((timeStamp: timeStamp, x: x, y: y, z: z))
                    }
                }
            }, onError: { [weak self] error in
                print("ACC streaming error: \(error)")
            Task { @MainActor in
                    self?.onlineStreamingFeature.isStreaming[.acc] = OnlineStreamingState.failed(error: error)
                }
            }, onCompleted: { [weak self] in
                    Task { @MainActor in
                    self?.onlineStreamingFeature.isStreaming[.acc] = OnlineStreamingState.success(url: nil)
                }
            })
        onlineStreamingDisposables[.acc] = disposable
            
            Task { @MainActor in
                self.onlineStreamingFeature.isStreaming[.acc] = OnlineStreamingState.inProgress
            }
    }
    
    func onlineStreamLogFileShared(at url: URL) {
        // Handle log file sharing if needed
    }
    
    
    private func classifyActivity(x: Int32, y: Int32, z: Int32) -> String {
        let magnitude = sqrt(Double(x*x + y*y + z*z))
        
        if magnitude < 1000 {
            return "resting"
        } else if magnitude < 2000 {
            return "sitting"
        } else if magnitude < 4000 {
            return "standing"
                    } else {
            return "walking"
        }
    }
    
    // MARK: - Patient and Session Management
    
    func setCurrentPatient(_ patientId: UUID) {
        currentPatientId = patientId
    }
    
    func startDataSession(sessionName: String, sessionType: String = "continuous_monitoring") {
        guard let patientId = currentPatientId,
              let deviceId = deviceId else { return }
        
        let session = DataSession(
            id: UUID(),
            patientId: patientId,
            deviceId: deviceId,
            sessionName: sessionName,
            sessionType: sessionType,
            startTime: Date(),
            endTime: nil,
            hrDataPoints: 0,
            accDataPoints: 0,
            dataCompletenessPercent: nil,
            notes: nil,
            createdAt: Date()
        )
        
        Task {
            do {
                let createdSession = try await supabaseManager.createDataSession(session)
                await MainActor.run {
                    self.currentSessionId = createdSession.id
                }
            } catch {
                print("Failed to create data session: \(error)")
                await MainActor.run {
                    self.currentSessionId = session.id
                }
            }
        }
    }
    
    func endDataSession() {
        guard let sessionId = currentSessionId else { return }
        
        // Update session with end time and statistics
        // Implementation depends on your needs
        currentSessionId = nil
    }
}

// MARK: - PolarBleApiObserver

extension PolarBleSdkManager: PolarBleApiObserver {
    func deviceConnecting(_ identifier: PolarDeviceInfo) {
        print("Connecting to \(identifier.0)")
                Task { @MainActor in
            self.deviceConnectionState = .connecting(identifier)
        }
    }
    
    func deviceConnected(_ identifier: PolarDeviceInfo) {
        print("Connected to \(identifier.0)")
                            Task { @MainActor in
            self.deviceConnectionState = .connected(identifier)
        }
    }
    
    func deviceDisconnected(_ identifier: PolarDeviceInfo, pairingError: Bool) {
        print("Disconnected from \(identifier.0)")
                Task { @MainActor in
            self.deviceConnectionState = .disconnected(identifier)
        }
    }
}

// MARK: - Supabase Upload Methods

extension PolarBleSdkManager {
    private func uploadHeartRateData(_ hrData: (hr: UInt8, ppgQuality: UInt8, correctedHr: UInt8, rrsMs: [Int], rrAvailable: Bool, contactStatus: Bool, contactStatusSupported: Bool)) {
        guard let currentPatientId = self.currentPatientId else {
            print("No current patient ID set")
            return
        }
        
        let uploadRequest = HeartRateUploadRequest(
            patientId: currentPatientId,
            deviceId: self.deviceId ?? "unknown",
            recordedAt: Date(),
            heartRate: Int(hrData.hr),
            rrAvailable: hrData.rrAvailable,
            rrIntervalMs: hrData.rrsMs.first,
            contactStatus: hrData.contactStatus,
            contactStatusSupported: hrData.contactStatusSupported,
            signalQuality: Int(hrData.ppgQuality)
        )
        
        Task {
            do {
                _ = try await supabaseManager.uploadHeartRateData(uploadRequest)
                print("Heart rate data uploaded successfully")
            } catch {
                print("Failed to upload heart rate data: \(error)")
            }
        }
    }
    
    private func uploadAccelerometerData(_ accData: (timeStamp: UInt64, x: Int32, y: Int32, z: Int32)) {
        guard let currentPatientId = self.currentPatientId else {
            print("No current patient ID set")
            return
        }
        
        let uploadRequest = AccelerometerUploadRequest(
            patientId: currentPatientId,
            deviceId: self.deviceId ?? "unknown",
            recordedAt: Date(),
            x: Double(accData.x),
            y: Double(accData.y),
            z: Double(accData.z),
            activityType: classifyActivity(x: accData.x, y: accData.y, z: accData.z)
        )
        
        Task {
            do {
                _ = try await supabaseManager.uploadAccelerometerData(uploadRequest)
                print("Accelerometer data uploaded successfully")
            } catch {
                print("Failed to upload accelerometer data: \(error)")
            }
        }
    }
    
    // MARK: - Supabase Testing
    
    func testSupabaseConnection() async -> Bool {
        print("🔍 Testing Supabase connection...")
        return await supabaseManager.testConnection()
    }
    
    func createTestPatient() async -> Bool {
        guard let currentPatientId = self.currentPatientId else {
            print("No current patient ID set - you need to set a patient ID first")
            return false
        }
        
        do {
            let patient = Patient(
                id: currentPatientId,
                firstName: "Test",
                lastName: "Patient",
                dateOfBirth: Date(),
                gender: "other",
                email: nil,
                phone: nil,
                heightCm: nil,
                weightKg: nil,
                potsDiagnosisDate: nil,
                primaryCarePhysician: nil,
                createdAt: Date(),
                updatedAt: Date()
            )
            
            _ = try await supabaseManager.createPatient(patient)
            print("✅ Successfully created test patient: \(patient.firstName) \(patient.lastName)")
            return true
        } catch {
            print("❌ Failed to create test patient: \(error)")
            return false
        }
    }
}

// MARK: - PolarBleApiPowerStateObserver

extension PolarBleSdkManager: PolarBleApiPowerStateObserver {
    func blePowerOn() {
        Task { @MainActor in
            self.isBluetoothOn = true
        }
    }
    
    func blePowerOff() {
        Task { @MainActor in
            self.isBluetoothOn = false
        }
    }
}

// MARK: - PolarBleApiDeviceFeaturesObserver

extension PolarBleSdkManager: PolarBleApiDeviceFeaturesObserver {
    func streamingFeaturesReady(_ identifier: String, streamingFeatures: Set<PolarDeviceDataType>) {
        Task { @MainActor in
            for feature in streamingFeatures {
                self.onlineStreamingFeature.availableOnlineDataTypes[feature] = true
            }
            self.onlineRecordingDataTypes = Array(streamingFeatures)
        }
    }
    
    func hrFeatureReady(_ identifier: String) {
        // HR feature is ready
    }
    
    func accFeatureReady(_ identifier: String) {
        // ACC feature is ready
    }
    
    func bleSdkFeatureReady(_ identifier: String, feature: PolarBleSdkFeature) {
        // SDK feature is ready
    }
}

// MARK: - PolarBleApiDeviceInfoObserver
    
extension PolarBleSdkManager: PolarBleApiDeviceInfoObserver {
    func batteryLevelReceived(_ identifier: String, batteryLevel: UInt) {
        Task { @MainActor in
            self.batteryStatusFeature.batteryLevel = batteryLevel
        }
    }
    
    func batteryChargingStatusReceived(_ identifier: String, chargingStatus: BleBasClient.ChargeState) {
        Task { @MainActor in
            print("Battery charging status: \(chargingStatus)")
        }
    }
    
    func disInformationReceived(_ identifier: String, uuid: CBUUID, value: String) {
            Task { @MainActor in
                self.deviceInfoFeature.firmwareVersion = value
        }
    }
    
    func disInformationReceivedWithKeysAsStrings(_ identifier: String, key: String, value: String) {
            Task { @MainActor in
            self.deviceInfoFeature.firmwareVersion = value
        }
    }
    
    func hrValueReceived(_ identifier: String, data: PolarHrData) {
            Task { @MainActor in
            self.hrRecordingData.hr = data[0].hr
            self.hrRecordingData.rrs = data[0].rrsMs.first ?? 0
            self.hrRecordingData.rrAvailable = !data[0].rrsMs.isEmpty
            self.hrRecordingData.contactStatus = data[0].contactStatus
            self.hrRecordingData.contactStatusSupported = data[0].contactStatusSupported
        }
    }
    
    func deviceInfoReceived(_ identifier: String, deviceInfo: PolarDeviceInfo) {
            Task { @MainActor in
            // PolarDeviceInfo is a tuple with (deviceId, address, rssi, name, connectable)
            // Firmware version is received separately via disInformationReceived
            print("Device info received: \(deviceInfo)")
        }
    }
    
    func deviceInfoReceived(_ identifier: String, deviceInfo: PolarDeviceInfo, timestamp: UInt64) {
            Task { @MainActor in
            print("Device info received with timestamp: \(deviceInfo)")
            }
            }
            
    func deviceInfoReceived(_ identifier: String, deviceInfo: PolarDeviceInfo, timestamp: UInt64, rssi: Int) {
            Task { @MainActor in
            print("Device info received with timestamp and rssi: \(deviceInfo)")
        }
    }
    
}

// MARK: - PolarBleApiLogger

extension PolarBleSdkManager: PolarBleApiLogger {
    func message(_ str: String) {
        NSLog(str)
    }
}
