//
//  PatientSetupView.swift
//  PSDC
//
//  Created for POTS Diagnostic App
//

import SwiftUI

struct PatientSetupView: View {
    @EnvironmentObject private var polarBleSdkManager: PolarBleSdkManager
    
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var isCreatingPatient = false
    @State private var showAlert = false
    @State private var alertMessage = ""
    @State private var showPatientCreated = false
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Patient Setup")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            Text("Create a patient record to start collecting data")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            
            VStack(spacing: 16) {
                TextField("First Name", text: $firstName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                TextField("Last Name", text: $lastName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            }
            .padding(.horizontal)
            
            Button(action: createPatient) {
                HStack {
                    if isCreatingPatient {
                        ProgressView()
                            .scaleEffect(0.8)
                    }
                    Text(isCreatingPatient ? "Creating Patient..." : "Create Patient")
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
            .disabled(firstName.isEmpty || lastName.isEmpty || isCreatingPatient)
            .padding(.horizontal)
            
            if let patientId = polarBleSdkManager.currentPatientId {
                VStack(spacing: 8) {
                    Text("✅ Patient ID Set")
                        .foregroundColor(.green)
                        .font(.headline)
                    
                    Text("ID: \(patientId.uuidString)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Text("Data collection is active!")
                        .font(.subheadline)
                        .foregroundColor(.blue)
                }
                .padding()
                .background(Color.green.opacity(0.1))
                .cornerRadius(10)
                .padding(.horizontal)
            }
            
            Spacer()
        }
        .padding()
        .alert("Patient Creation", isPresented: $showAlert) {
            Button("OK") { }
        } message: {
            Text(alertMessage)
        }
        .alert("Success!", isPresented: $showPatientCreated) {
            Button("OK") { }
        } message: {
            Text("Patient created successfully! Data collection is now active.")
        }
    }
    
    private func createPatient() {
        guard !firstName.isEmpty && !lastName.isEmpty else { return }
        
        isCreatingPatient = true
        
        Task {
            // Generate a new patient ID
            let newPatientId = UUID()
            
            // Set the patient ID first
            await MainActor.run {
                polarBleSdkManager.setCurrentPatient(newPatientId)
            }
            
            // Create the patient in Supabase
            let success = await polarBleSdkManager.createTestPatient()
            
            await MainActor.run {
                isCreatingPatient = false
                
                if success {
                    showPatientCreated = true
                } else {
                    alertMessage = "Failed to create patient in database. Check your Supabase connection."
                    showAlert = true
                }
            }
        }
    }
}

#Preview {
    PatientSetupView()
        .environmentObject(PolarBleSdkManager.shared)
}
