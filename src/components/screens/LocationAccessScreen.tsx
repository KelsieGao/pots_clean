import React from 'react';
import { ArrowLeft, MapPin, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface LocationAccessScreenProps {
  onEnable: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export function LocationAccessScreen({ onEnable, onSkip, onBack }: LocationAccessScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Location Access</h1>
        </div>

        <Card className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Optional Location Context</h2>
            <p className="text-gray-600">
              Allow location access to add context to your symptom episodes (like home, school, or work).
            </p>
          </div>

          {/* Privacy Explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Your Privacy is Protected</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Location is only recorded when you log an episode</li>
                  <li>• We don't track your location in the background</li>
                  <li>• You can disable this anytime in settings</li>
                  <li>• Location data stays encrypted and secure</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">How this helps:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Identify environmental triggers (home vs. school vs. outdoors)</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Help your doctor understand symptom patterns</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Provide richer context for your care team</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button onClick={onEnable} size="lg" className="w-full">
              <MapPin className="w-5 h-5 mr-2" />
              Enable Location
            </Button>
            <Button onClick={onSkip} variant="outline" size="lg" className="w-full">
              Skip for Now
            </Button>
          </div>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>You can change this setting anytime in the app</p>
        </div>
      </div>
    </div>
  );
}