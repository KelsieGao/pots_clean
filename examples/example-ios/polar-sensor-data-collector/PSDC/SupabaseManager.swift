//
//  SupabaseManager.swift
//  PSDC
//
//  Created for POTS Diagnostic App
//

import Foundation
import Supabase
import Combine

class SupabaseManager: ObservableObject {
    static let shared = SupabaseManager()
    
    private let supabase: SupabaseClient
    
    @Published var isConnected = false
    @Published var uploadProgress: Double = 0.0
    @Published var lastUploadError: String?
    
    private var uploadQueue: [Any] = []
    private var isUploading = false
    
    private init() {
        let config = SupabaseConfig.currentConfig
        self.supabase = SupabaseClient(supabaseURL: URL(string: config.url)!, supabaseKey: config.key)
        checkConnection()
    }
    
    // MARK: - Connection Management
    
    private func checkConnection() {
        Task {
            do {
                // Simple connection test
                let _: [Patient] = try await supabase.database
                    .from("patients")
                    .select()
                    .limit(1)
                    .execute()
                    .value
                
                await MainActor.run {
                    self.isConnected = true
                }
            } catch {
                await MainActor.run {
                    self.isConnected = false
                    self.lastUploadError = error.localizedDescription
                }
            }
        }
    }
    
    // MARK: - Patient Management
    
    func createPatient(_ patient: Patient) async throws -> Patient {
        let response: [Patient] = try await supabase.database
            .from("patients")
            .insert(patient)
            .select()
            .single()
            .execute()
            .value
        
        return response.first ?? patient
    }
    
    func getPatient(id: UUID) async throws -> Patient {
        let response: [Patient] = try await supabase.database
            .from("patients")
            .select()
            .eq("id", value: id)
            .single()
            .execute()
            .value
        
        guard let patient = response.first else {
            throw NSError(domain: "SupabaseManager", code: -1, userInfo: [NSLocalizedDescriptionKey: "Patient not found"])
        }
        return patient
    }
    
    func updatePatient(_ patient: Patient) async throws -> Patient {
        let response: [Patient] = try await supabase.database
            .from("patients")
            .update(patient)
            .eq("id", value: patient.id)
            .select()
            .single()
            .execute()
            .value
        
        guard let updatedPatient = response.first else {
            throw NSError(domain: "SupabaseManager", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to update patient"])
        }
        return updatedPatient
    }
    
    // MARK: - Heart Rate Data Upload
    
    func uploadHeartRateData(_ data: HeartRateUploadRequest) async throws -> HeartRateData {
        let response: [HeartRateData] = try await supabase.database
            .from("heartrate_data")
            .insert(data)
            .select()
            .single()
            .execute()
            .value
        
        guard let heartRateData = response.first else {
            throw NSError(domain: "SupabaseManager", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to upload heart rate data"])
        }
        return heartRateData
    }
    
    func uploadHeartRateDataBatch(_ dataArray: [HeartRateUploadRequest]) async throws -> [HeartRateData] {
        let response: [HeartRateData] = try await supabase.database
            .from("heartrate_data")
            .insert(dataArray)
            .select()
            .execute()
            .value
        
        return response
    }
    
    // MARK: - Accelerometer Data Upload
    
    func uploadAccelerometerData(_ data: AccelerometerUploadRequest) async throws -> AccelerometerData {
        let response: [AccelerometerData] = try await supabase.database
            .from("accelerometer_data")
            .insert(data)
            .select()
            .single()
            .execute()
            .value
        
        guard let accelerometerData = response.first else {
            throw NSError(domain: "SupabaseManager", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to upload accelerometer data"])
        }
        return accelerometerData
    }
    
    func uploadAccelerometerDataBatch(_ dataArray: [AccelerometerUploadRequest]) async throws -> [AccelerometerData] {
        let response: [AccelerometerData] = try await supabase.database
            .from("accelerometer_data")
            .insert(dataArray)
            .select()
            .execute()
            .value
        
        return response
    }
    
    // MARK: - Data Session Management
    
    func createDataSession(_ session: DataSession) async throws -> DataSession {
        let response: [DataSession] = try await supabase.database
            .from("data_sessions")
            .insert(session)
            .select()
            .single()
            .execute()
            .value
        
        guard let dataSession = response.first else {
            throw NSError(domain: "SupabaseManager", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to create data session"])
        }
        return dataSession
    }
    
    func updateDataSession(_ session: DataSession) async throws -> DataSession {
        let response: [DataSession] = try await supabase.database
            .from("data_sessions")
            .update(session)
            .eq("id", value: session.id)
            .select()
            .single()
            .execute()
            .value
        
        guard let updatedSession = response.first else {
            throw NSError(domain: "SupabaseManager", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to update data session"])
        }
        return updatedSession
    }
    
    // MARK: - Queue Management (Non-functional until Supabase integration)
    
    func queueHeartRateData(_ data: HeartRateUploadRequest) {
        uploadQueue.append(data)
        processUploadQueue()
    }
    
    func queueAccelerometerData(_ data: AccelerometerUploadRequest) {
        uploadQueue.append(data)
        processUploadQueue()
    }
    
    private func processUploadQueue() {
        guard !isUploading && !uploadQueue.isEmpty else { return }
        
        isUploading = true
        
        Task {
            do {
                let batchSize = 100
                let batches = uploadQueue.chunked(into: batchSize)
                
                for (index, batch) in batches.enumerated() {
                    try await uploadBatch(batch)
                    
                    await MainActor.run {
                        self.uploadProgress = Double(index + 1) / Double(batches.count)
                    }
                }
                
                await MainActor.run {
                    self.uploadQueue.removeAll()
                    self.isUploading = false
                    self.uploadProgress = 1.0
                    self.lastUploadError = nil
                }
                
            } catch {
                await MainActor.run {
                    self.isUploading = false
                    self.lastUploadError = error.localizedDescription
                    self.uploadProgress = 0.0
                }
            }
        }
    }
    
    private func uploadBatch(_ batch: [Any]) async throws {
        let heartRateData = batch.compactMap { $0 as? HeartRateUploadRequest }
        let accelerometerData = batch.compactMap { $0 as? AccelerometerUploadRequest }
        
        if !heartRateData.isEmpty {
            _ = try await uploadHeartRateDataBatch(heartRateData)
        }
        
        if !accelerometerData.isEmpty {
            _ = try await uploadAccelerometerDataBatch(accelerometerData)
        }
    }
}

// MARK: - Array Extension for Batching
extension Array {
    func chunked(into size: Int) -> [[Element]] {
        return stride(from: 0, to: count, by: size).map {
            Array(self[$0..<Swift.min($0 + size, count)])
        }
    }
}

// MARK: - Configuration Helper
extension SupabaseManager {
    func configure(url: String, anonKey: String) {
        // This would be called during app initialization
        // with actual Supabase credentials from a secure source
        print("Supabase configured with URL: \(url)")
    }
    
    // MARK: - Test Connection Method
    func testConnection() async -> Bool {
        do {
            let _: [Patient] = try await supabase.database
                .from("patients")
                .select()
                .limit(1)
                .execute()
                .value
            
            await MainActor.run {
                self.isConnected = true
            }
            print("✅ Supabase connection test successful!")
            return true
        } catch {
            await MainActor.run {
                self.isConnected = false
                self.lastUploadError = error.localizedDescription
            }
            print("❌ Supabase connection test failed: \(error)")
            return false
        }
    }
}