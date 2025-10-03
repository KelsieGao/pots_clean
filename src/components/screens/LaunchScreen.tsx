import React from 'react';
import { Heart, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface LaunchScreenProps {
  onLogin: () => void;
  onNewUser: () => void;
  onClinicianLogin: () => void;
}

export function LaunchScreen({ onLogin, onNewUser, onClinicianLogin }: LaunchScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and App Name */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">POTSITIVE Tracker</h1>
            <p className="text-gray-600 mt-2">Digital health monitoring for POTS patients</p>
          </div>
        </div>

        {/* Main Actions */}
        <Card className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Welcome</h2>
            <p className="text-gray-600 text-sm">
              Securely log your symptoms and heart rate data
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={onNewUser}
              size="lg" 
              className="w-full"
            >
              New Patient - Enter Code
            </Button>
            
            <Button 
              onClick={onLogin}
              variant="outline" 
              size="lg" 
              className="w-full"
            >
              Returning Patient - Login
            </Button>
            
            <Button 
              onClick={onClinicianLogin}
              variant="primary" 
              size="lg" 
              className="w-full"
            >
              Clinician Login - Enter Code
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <Shield className="w-4 h-4" />
            <span>HIPAA compliant and secure</span>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>This app is not intended for emergency use.</p>
          <p className="mt-1">Contact your healthcare provider for medical concerns.</p>
        </div>
      </div>
    </div>
  );
}