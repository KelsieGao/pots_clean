//  Copyright © 2024 Polar. All rights reserved.
//

import Foundation
import PolarBleSdk

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

struct RecordingSettings {
    let feature: PolarDeviceDataType
    let settings: PolarSensorSettings
}
