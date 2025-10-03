//
//  SupabaseModels.swift
//  PSDC
//
//  Created for POTS Diagnostic App
//

import Foundation
import Supabase

// MARK: - Patient Model
struct Patient: Codable, Identifiable {
    let id: UUID
    let firstName: String
    let lastName: String
    let dateOfBirth: Date
    let gender: String
    let email: String?
    let phone: String?
    let heightCm: Int?
    let weightKg: Double?
    let potsDiagnosisDate: Date?
    let primaryCarePhysician: String?
    let createdAt: Date
    let updatedAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case firstName = "first_name"
        case lastName = "last_name"
        case dateOfBirth = "date_of_birth"
        case gender
        case email
        case phone
        case heightCm = "height_cm"
        case weightKg = "weight_kg"
        case potsDiagnosisDate = "pots_diagnosis_date"
        case primaryCarePhysician = "primary_care_physician"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

// MARK: - Heart Rate Data Model
struct HeartRateData: Codable, Identifiable {
    let id: UUID
    let patientId: UUID
    let deviceId: String
    let recordedAt: Date
    let heartRate: Int
    let rrAvailable: Bool
    let rrIntervalMs: Int?
    let contactStatus: Bool?
    let contactStatusSupported: Bool?
    let signalQuality: Int?
    let createdAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case patientId = "patient_id"
        case deviceId = "device_id"
        case recordedAt = "recorded_at"
        case heartRate = "heart_rate"
        case rrAvailable = "rr_available"
        case rrIntervalMs = "rr_interval_ms"
        case contactStatus = "contact_status"
        case contactStatusSupported = "contact_status_supported"
        case signalQuality = "signal_quality"
        case createdAt = "created_at"
    }
}

// MARK: - Accelerometer Data Model
struct AccelerometerData: Codable, Identifiable {
    let id: UUID
    let patientId: UUID
    let deviceId: String
    let recordedAt: Date
    let x: Double
    let y: Double
    let z: Double
    let magnitude: Double?
    let activityType: String?
    let createdAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case patientId = "patient_id"
        case deviceId = "device_id"
        case recordedAt = "recorded_at"
        case x
        case y
        case z
        case magnitude
        case activityType = "activity_type"
        case createdAt = "created_at"
    }
}

// MARK: - Stand-Up Test Model
struct StandUpTest: Codable, Identifiable {
    let id: UUID
    let patientId: UUID
    let testDate: Date
    let testTime: String
    let supineHr: Int?
    let supineSystolic: Int?
    let supineDiastolic: Int?
    let supineDurationMinutes: Int?
    let standing1minHr: Int?
    let standing1minSystolic: Int?
    let standing1minDiastolic: Int?
    let standing3minHr: Int?
    let standing3minSystolic: Int?
    let standing3minDiastolic: Int?
    let standing5minHr: Int?
    let standing10minHr: Int?
    let hrIncrease1min: Int?
    let hrIncrease3min: Int?
    let hrIncrease5min: Int?
    let hrIncrease10min: Int?
    let systolicDrop1min: Int?
    let systolicDrop3min: Int?
    let testResult: String?
    let potsSeverity: String?
    let notes: String?
    let roomTemperature: Double?
    let timeSinceLastMeal: Int?
    let medicationsTaken: String?
    let createdAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case patientId = "patient_id"
        case testDate = "test_date"
        case testTime = "test_time"
        case supineHr = "supine_hr"
        case supineSystolic = "supine_systolic"
        case supineDiastolic = "supine_diastolic"
        case supineDurationMinutes = "supine_duration_minutes"
        case standing1minHr = "standing_1min_hr"
        case standing1minSystolic = "standing_1min_systolic"
        case standing1minDiastolic = "standing_1min_diastolic"
        case standing3minHr = "standing_3min_hr"
        case standing3minSystolic = "standing_3min_systolic"
        case standing3minDiastolic = "standing_3min_diastolic"
        case standing5minHr = "standing_5min_hr"
        case standing10minHr = "standing_10min_hr"
        case hrIncrease1min = "hr_increase_1min"
        case hrIncrease3min = "hr_increase_3min"
        case hrIncrease5min = "hr_increase_5min"
        case hrIncrease10min = "hr_increase_10min"
        case systolicDrop1min = "systolic_drop_1min"
        case systolicDrop3min = "systolic_drop_3min"
        case testResult = "test_result"
        case potsSeverity = "pots_severity"
        case notes
        case roomTemperature = "room_temperature"
        case timeSinceLastMeal = "time_since_last_meal"
        case medicationsTaken = "medications_taken"
        case createdAt = "created_at"
    }
}

// MARK: - Symptom Log Model
struct SymptomLog: Codable, Identifiable {
    let id: UUID
    let patientId: UUID
    let loggedAt: Date
    let symptomType: String
    let severity: Int
    let durationMinutes: Int?
    let position: String?
    let triggerFactors: [String]?
    let hrDuringSymptom: Int?
    let bpDuringSymptomSystolic: Int?
    let bpDuringSymptomDiastolic: Int?
    let notes: String?
    let createdAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case patientId = "patient_id"
        case loggedAt = "logged_at"
        case symptomType = "symptom_type"
        case severity
        case durationMinutes = "duration_minutes"
        case position
        case triggerFactors = "trigger_factors"
        case hrDuringSymptom = "hr_during_symptom"
        case bpDuringSymptomSystolic = "bp_during_symptom_systolic"
        case bpDuringSymptomDiastolic = "bp_during_symptom_diastolic"
        case notes
        case createdAt = "created_at"
    }
}

// MARK: - VOSS Questionnaire Model
struct VOSSQuestionnaire: Codable, Identifiable {
    let id: UUID
    let patientId: UUID
    let completedAt: Date
    let symptomFrequency: Int?
    let symptomSeverity: Int?
    let dizzinessFrequency: Int?
    let fatigueLevel: Int?
    let orthostaticIntolerance: Int?
    let cognitiveSymptoms: Int?
    let sleepQuality: Int?
    let totalScore: Int?
    let interpretation: String?
    let notes: String?
    let createdAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case patientId = "patient_id"
        case completedAt = "completed_at"
        case symptomFrequency = "symptom_frequency"
        case symptomSeverity = "symptom_severity"
        case dizzinessFrequency = "dizziness_frequency"
        case fatigueLevel = "fatigue_level"
        case orthostaticIntolerance = "orthostatic_intolerance"
        case cognitiveSymptoms = "cognitive_symptoms"
        case sleepQuality = "sleep_quality"
        case totalScore = "total_score"
        case interpretation
        case notes
        case createdAt = "created_at"
    }
}

// MARK: - Device Model
struct Device: Codable, Identifiable {
    let id: UUID
    let patientId: UUID
    let deviceId: String
    let deviceName: String?
    let deviceType: String?
    let batteryLevel: Int?
    let firmwareVersion: String?
    let lastSync: Date?
    let isActive: Bool?
    let totalRecordingHours: Int?
    let lastMaintenanceDate: Date?
    let createdAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case patientId = "patient_id"
        case deviceId = "device_id"
        case deviceName = "device_name"
        case deviceType = "device_type"
        case batteryLevel = "battery_level"
        case firmwareVersion = "firmware_version"
        case lastSync = "last_sync"
        case isActive = "is_active"
        case totalRecordingHours = "total_recording_hours"
        case lastMaintenanceDate = "last_maintenance_date"
        case createdAt = "created_at"
    }
}

// MARK: - Data Session Model
struct DataSession: Codable, Identifiable {
    let id: UUID
    let patientId: UUID
    let deviceId: String
    let sessionName: String?
    let sessionType: String?
    let startTime: Date
    let endTime: Date?
    let hrDataPoints: Int?
    let accDataPoints: Int?
    let dataCompletenessPercent: Double?
    let notes: String?
    let createdAt: Date
    
    enum CodingKeys: String, CodingKey {
        case id
        case patientId = "patient_id"
        case deviceId = "device_id"
        case sessionName = "session_name"
        case sessionType = "session_type"
        case startTime = "start_time"
        case endTime = "end_time"
        case hrDataPoints = "hr_data_points"
        case accDataPoints = "acc_data_points"
        case dataCompletenessPercent = "data_completeness_percent"
        case notes
        case createdAt = "created_at"
    }
}

// MARK: - POTS Analysis Result
struct POTSAnalysisResult: Codable {
    let avgHrLying: Double
    let avgHrStanding: Double
    let hrIncreaseStanding: Double
    let hrVariability: Double
    let potsRiskScore: Double
    
    enum CodingKeys: String, CodingKey {
        case avgHrLying = "avg_hr_lying"
        case avgHrStanding = "avg_hr_standing"
        case hrIncreaseStanding = "hr_increase_standing"
        case hrVariability = "hr_variability"
        case potsRiskScore = "pots_risk_score"
    }
}

// MARK: - Data Upload Request Models
struct HeartRateUploadRequest: Codable {
    let patientId: UUID
    let deviceId: String
    let recordedAt: Date
    let heartRate: Int
    let rrAvailable: Bool
    let rrIntervalMs: Int?
    let contactStatus: Bool?
    let contactStatusSupported: Bool?
    let signalQuality: Int?
    
    enum CodingKeys: String, CodingKey {
        case patientId = "patient_id"
        case deviceId = "device_id"
        case recordedAt = "recorded_at"
        case heartRate = "heart_rate"
        case rrAvailable = "rr_available"
        case rrIntervalMs = "rr_interval_ms"
        case contactStatus = "contact_status"
        case contactStatusSupported = "contact_status_supported"
        case signalQuality = "signal_quality"
    }
}

struct AccelerometerUploadRequest: Codable {
    let patientId: UUID
    let deviceId: String
    let recordedAt: Date
    let x: Double
    let y: Double
    let z: Double
    let activityType: String?
    
    enum CodingKeys: String, CodingKey {
        case patientId = "patient_id"
        case deviceId = "device_id"
        case recordedAt = "recorded_at"
        case x
        case y
        case z
        case activityType = "activity_type"
    }
}
