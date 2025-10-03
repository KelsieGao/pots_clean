//
//  SupabaseConfig.swift
//  PSDC
//
//  Configuration for Supabase integration
//

import Foundation

struct SupabaseConfig {
    // TODO: Replace these with your actual Supabase project credentials
    // Get these from your Supabase project dashboard: Settings → API
    
    static let url = "https://0ec90b57d6e95fcbda19832f.supabase.co"
    static let anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw"
    
    // For production, these should be stored securely:
    // - Use environment variables
    // - Store in Keychain
    // - Use a secure configuration service
    
    // Example of how to load from environment variables:
    static func loadFromEnvironment() -> (url: String, key: String) {
        let url = ProcessInfo.processInfo.environment["SUPABASE_URL"] ?? Self.url
        let key = ProcessInfo.processInfo.environment["SUPABASE_ANON_KEY"] ?? Self.anonKey
        return (url: url, key: key)
    }
    
    // Example of how to load from a secure configuration file:
    static func loadFromSecureConfig() -> (url: String, key: String) {
        // This would load from a secure configuration file
        // that's not committed to version control
        return (url: Self.url, key: Self.anonKey)
    }
}

// MARK: - Development vs Production Configuration
extension SupabaseConfig {
    static var isDevelopment: Bool {
        #if DEBUG
        return true
        #else
        return false
        #endif
    }
    
    static var currentConfig: (url: String, key: String) {
        if isDevelopment {
            return loadFromEnvironment()
        } else {
            return loadFromSecureConfig()
        }
    }
}
