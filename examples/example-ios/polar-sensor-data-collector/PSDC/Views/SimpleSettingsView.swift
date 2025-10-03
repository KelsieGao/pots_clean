/// Copyright © 2021 Polar Electro Oy. All rights reserved.

import SwiftUI
import PolarBleSdk

struct SimpleSettingsView: View {
    @EnvironmentObject private var bleSdkManager: PolarBleSdkManager
    let streamedFeature: PolarDeviceDataType
    let streamSettings: RecordingSettings
    
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        NavigationView {
            VStack {
                Text("Use default settings for \(getShortNameForDataType(streamedFeature)) streaming")
                    .padding()
                
                Button("Start Streaming") {
                    startStreamingWithDefaultSettings()
                    presentationMode.wrappedValue.dismiss()
                }
                .buttonStyle(PrimaryButtonStyle(buttonState: ButtonState.released))
                .padding()
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("Cancel") {
                    presentationMode.wrappedValue.dismiss()
                }
            )
        }
    }
    
    private func startStreamingWithDefaultSettings() {
        guard let deviceId = bleSdkManager.deviceId else { return }
        
        if streamedFeature == .acc {
            // Use the settings from the streamSettings
            bleSdkManager.startAccStreaming(deviceId: deviceId, settings: streamSettings.settings)
        }
    }
}

struct SimpleSettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SimpleSettingsView(
            streamedFeature: .acc,
            streamSettings: RecordingSettings(feature: .acc, settings: try! PolarSensorSetting([:]))
        )
    }
}
