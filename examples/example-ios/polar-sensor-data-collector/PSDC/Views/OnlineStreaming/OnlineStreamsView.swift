/// Copyright © 2022 Polar Electro Oy. All rights reserved.

import Foundation
import SwiftUI
import PolarBleSdk

struct OnlineStreamsView: View {
    @EnvironmentObject private var bleSdkManager: PolarBleSdkManager
    @State private var urlToShare: IdentifiableURL?
    @State private var showPatientSetup = false
    
    func shareURL(url: URL) {
        urlToShare = IdentifiableURL(url: url)
    }
    
    var body: some View {

        if case .connected = bleSdkManager.deviceConnectionState {
            VStack {
                // Patient Status Section
                if let patientId = bleSdkManager.currentPatientId {
                    VStack(spacing: 8) {
                        Text("✅ Patient Active")
                            .foregroundColor(.green)
                            .font(.headline)
                        Text("Data uploading to Supabase")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                    .background(Color.green.opacity(0.1))
                    .cornerRadius(10)
                } else {
                    VStack(spacing: 8) {
                        Text("⚠️ No Patient Set")
                            .foregroundColor(.orange)
                            .font(.headline)
                        Text("Set patient ID to enable data upload")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Button("Set Patient") {
                            showPatientSetup = true
                        }
                        .padding(.top, 4)
                    }
                    .padding()
                    .background(Color.orange.opacity(0.1))
                    .cornerRadius(10)
                }
                
                // Only show HR and ACC streaming options
                VStack {
                    HStack {
                        OnlineStreamingButton(dataType: .hr)
                        Spacer()
                        if case let .success(urlOptional) = bleSdkManager.onlineStreamingFeature.isStreaming[.hr],
                           let url = urlOptional {
                            ShareButton() { shareURL(url: url) }
                                .padding(.trailing)
                        }
                    }
                    HStack {
                        OnlineStreamingButton(dataType: .acc)
                        Spacer()
                        if case let .success(urlOptional) = bleSdkManager.onlineStreamingFeature.isStreaming[.acc],
                           let url = urlOptional {
                            ShareButton() { shareURL(url: url) }
                                .padding(.trailing)
                        }
                    }
                }
                OnlineStreamValues()
            }
            .fullScreenCover(item: $bleSdkManager.onlineStreamSettings) { streamSettings in
                SimpleSettingsView(streamedFeature: streamSettings.feature, streamSettings: streamSettings)
            }
            .sheet(isPresented: $showPatientSetup) {
                PatientSetupView()
                    .environmentObject(bleSdkManager)
            }
            .sheet(
                item: Binding(
                    get: { urlToShare },
                    set: { newValue in
                        if let url = urlToShare?.url {
                            bleSdkManager.onlineStreamLogFileShared(at: url)
                        }
                        urlToShare = newValue
                    }
                ),
                content: { identifiableURL in ActivityViewController(activityItems: [identifiableURL.url], applicationActivities: nil)}
            )
        }
    }
}

struct OnlineStreamingButton: View {
    let dataType: PolarDeviceDataType
    @EnvironmentObject private var bleSdkManager: PolarBleSdkManager
    
    var body: some View {
        Button(getStreamButtonText(dataType, bleSdkManager.onlineStreamingFeature.isStreaming[dataType]),
               action: { streamButtonToggle(dataType) })
        .buttonStyle(SecondaryButtonStyle(buttonState: getStreamButtonState(dataType)))
        .disabled(getEnableStreamingButton(buttonState: getStreamButtonState(dataType)))
    }
    
    private func getEnableStreamingButton(buttonState: ButtonState) -> Bool {

        if (buttonState == ButtonState.disabled) {
            return true
        } else {
            return false
        }
    }

    private func getStreamButtonText(_ feature:PolarDeviceDataType, _ isStreaming: OnlineStreamingState?) -> String {
        let text = getShortNameForDataType(feature)
        let buttonText:String
        switch(isStreaming ?? .success(url: nil)) {
        case .inProgress:
            buttonText = "Stop \(text) Stream"
        case .success(url: _):
            buttonText = "Start \(text) Stream"
        case .failed(error: _):
            buttonText = "Start \(text) Stream"
        }
        return buttonText
    }
    
    private func streamButtonToggle(_ feature:PolarDeviceDataType) {
        NSLog("Stream toggle for feature \(feature)")
        if(bleSdkManager.isStreamOn(feature: feature)) {
            bleSdkManager.onlineStreamStop(feature: feature)
        } else {
            if(feature == PolarDeviceDataType.ppi || feature == PolarDeviceDataType.hr) {
                bleSdkManager.onlineStreamStart(feature: feature)
            } else {
                bleSdkManager.getOnlineStreamSettings(feature: feature)
            }
        }
    }
    
    private func getStreamButtonState(_ feature: PolarDeviceDataType) -> ButtonState {
        if bleSdkManager.isStreamOn(feature: feature) {
            return ButtonState.pressedDown
        } else {
            return ButtonState.released
        }
    }
}

struct OnlineStreamValues: View {
    @EnvironmentObject private var bleSdkManager: PolarBleSdkManager
    var body: some View {
        
        VStack(alignment: .leading, spacing: 6) {
            // Heart Rate values
            VStack(alignment: .leading, spacing: 6) {
                if bleSdkManager.isStreamOn(feature: .hr) {
                    Text("Heart rate values:")
                        .font(.system(size: 16)).bold()
                    Text("Heart rate: \(bleSdkManager.hrRecordingData.hr)")
                        .font(.system(size: 14))
                    Text("RR available: \(bleSdkManager.hrRecordingData.rrAvailable)")
                        .font(.system(size: 14))
                    Text("RRs: \(bleSdkManager.hrRecordingData.rrs)")
                        .font(.system(size: 14))
                    Text("Contact status supported: \(bleSdkManager.hrRecordingData.contactStatusSupported)")
                        .font(.system(size: 14))
                    Text("Contact status: \(bleSdkManager.hrRecordingData.contactStatus)")
                        .font(.system(size: 14))
                }
            }
            
            // Accelerometer values
            VStack(alignment: .leading, spacing: 6) {
                if bleSdkManager.isStreamOn(feature: .acc) {
                    Text("Accelerometer values:")
                        .font(.system(size: 16)).bold()
                    Text("Accelerometer: x: \(bleSdkManager.accRecordingData.x), y: \(bleSdkManager.accRecordingData.y), z: \(bleSdkManager.accRecordingData.z)")
                        .font(.system(size: 14))
                }
            }
        }
    }
}

fileprivate struct ShareButton: View {
    var action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Image(systemName: "square.and.arrow.up")
                .font(.system(size: 28))
        }
    }
}

fileprivate struct ActivityViewController: UIViewControllerRepresentable {
    let activityItems: [Any]
    let applicationActivities: [UIActivity]?
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
        let controller = UIActivityViewController(activityItems: activityItems, applicationActivities: applicationActivities)
        return controller
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

fileprivate struct IdentifiableURL: Identifiable {
    let id = UUID()
    let url: URL
}

extension PolarDeviceDataType: Identifiable {
    public var id: Int {
        switch self {
        case .ecg:
            return 1
        case .acc:
            return 2
        case .ppg:
            return 3
        case .ppi:
            return 4
        case .gyro:
            return 5
        case .magnetometer:
            return 6
        case .hr:
            return 7
        case .temperature:
            return 8
        case .pressure:
            return 9
        case .skinTemperature:
            return 10
        }
    }
}

struct OnlineStreamsView_Previews: PreviewProvider {
    static var previews: some View {
        return OnlineStreamsView()
            .environmentObject(PolarBleSdkManager())
    }
}
