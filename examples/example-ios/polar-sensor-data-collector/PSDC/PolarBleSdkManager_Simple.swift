/// Copyright © 2021 Polar Electro Oy. All rights reserved.

import Foundation
import PolarBleSdk
import RxSwift
import CoreBluetooth

/// Simplified PolarBleSdkManager for HR and ACC data collection only
class PolarBleSdkManager : ObservableObject {
    
    private var api = PolarBleApiDefaultImpl.polarImplementation(DispatchQueue.main,
                                                                 features: [PolarBleSdkFeature.feature_hr,
                                                                            PolarBleSdkFeature.feature_battery_info,
                                                                            PolarBleSdkFeature.feature_device_info,
                                                                            PolarBleSdkFeature.feature_polar_online_streaming]
    )
    
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
        onlineStreamingDisposables[feature]?.dispose()
        onlineStreamingDisposables[feature] = nil
        
        Task { @MainActor in
            self.onlineStreamingFeature.isStreaming[feature] = .success(url: nil)
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
                        self?.hrRecordingData.contactStatus = hrData[0].contact
                        self?.hrRecordingData.contactStatusSupported = hrData[0].contactSupported
                    }
                case .completed:
                    Task { @MainActor in
                        self?.onlineStreamingFeature.isStreaming[.hr] = .success(url: nil)
                    }
                case .error(let error):
                    print("HR streaming error: \(error)")
                    Task { @MainActor in
                        self?.onlineStreamingFeature.isStreaming[.hr] = .failed(error: error)
                    }
                }
            }
        
        Task { @MainActor in
            self.onlineStreamingFeature.isStreaming[.hr] = .inProgress
        }
    }
    
    func startAccStreaming(deviceId: String, settings: PolarSensorSetting) {
        onlineStreamingDisposables[.acc] = api.startAccStreaming(deviceId, settings: settings)
            .observe(on: MainScheduler.instance)
            .subscribe { [weak self] event in
                switch event {
                case .next(let accData):
                    Task { @MainActor in
                        if let sample = accData.samples.first {
                            let (x, y, z) = sample
                            self?.accRecordingData.x = x
                            self?.accRecordingData.y = y
                            self?.accRecordingData.z = z
                            self?.accRecordingData.timestamp = accData.timeStamp
                        }
                    }
                case .completed:
                    Task { @MainActor in
                        self?.onlineStreamingFeature.isStreaming[.acc] = .success(url: nil)
                    }
                case .error(let error):
                    print("ACC streaming error: \(error)")
                    Task { @MainActor in
                        self?.onlineStreamingFeature.isStreaming[.acc] = .failed(error: error)
                    }
                }
            }
        
        Task { @MainActor in
            self.onlineStreamingFeature.isStreaming[.acc] = .inProgress
        }
    }
    
    func onlineStreamLogFileShared(at url: URL) {
        // Handle log file sharing if needed
    }
}

// MARK: - PolarBleApiObserver

extension PolarBleSdkManager: PolarBleApiObserver {
    func deviceConnecting(_ identifier: PolarDeviceInfo) {
        print("Connecting to \(identifier.deviceId)")
        Task { @MainActor in
            self.deviceConnectionState = .connecting(identifier)
        }
    }
    
    func deviceConnected(_ identifier: PolarDeviceInfo) {
        print("Connected to \(identifier.deviceId)")
        updateStateWhenDeviceConnected(device: identifier)
    }
    
    func deviceDisconnected(_ identifier: PolarDeviceInfo, pairingError: Bool) {
        print("Disconnected from \(identifier.deviceId)")
        updateStateWhenDeviceDisconnected(withId: identifier.deviceId, pairingError: pairingError)
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
}

// MARK: - PolarBleApiDeviceInfoObserver

extension PolarBleSdkManager: PolarBleApiDeviceInfoObserver {
    func batteryLevelReceived(_ identifier: String, batteryLevel: UInt) {
        Task { @MainActor in
            self.batteryStatusFeature.batteryLevel = batteryLevel
        }
    }
    
    func disInformationReceived(_ identifier: String, uuid: CBUUID, value: String) {
        Task { @MainActor in
            self.deviceInfoFeature.firmwareVersion = value
        }
    }
}

// MARK: - PolarBleApiLogger

extension PolarBleSdkManager: PolarBleApiLogger {
    func message(_ str: String) {
        NSLog(str)
    }
}
