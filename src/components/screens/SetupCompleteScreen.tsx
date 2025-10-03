import React from 'react';
import { CheckCircle, Calendar, Heart, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface SetupCompleteScreenProps {
  onContinue: () => void;
}

export function SetupCompleteScreen({ onContinue }: SetupCompleteScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Setup Complete!</h2>
            <p className="text-gray-600">
              Your app is ready to start collecting data. Here's what happens next:
            </p>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Calendar className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Daily Sit/Stand Tests</h3>
                <p className="text-sm text-gray-600">
                  Complete a 5-minute guided test each day for 5 days to establish your baseline.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Heart className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Log Symptoms</h3>
                <p className="text-sm text-gray-600">
                  Track episodes and symptoms as they happen throughout your day.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <FileText className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Final Report</h3>
                <p className="text-sm text-gray-600">
                  After 5 days, we'll generate a comprehensive report for your doctor.
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-medium text-amber-900 mb-2">Important Reminders:</h3>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>• Complete your daily test at the same time each day</li>
              <li>• Log symptoms as they happen for accurate data</li>
              <li>• Keep your heart rate monitor charged and nearby</li>
              <li>• This app is for monitoring, not emergency situations</li>
            </ul>
          </div>

          <Button onClick={onContinue} size="lg" className="w-full">
            Start My 5-Day Journey
          </Button>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>Questions? Contact support anytime through the app settings</p>
        </div>
      </div>
    </div>
  );
}