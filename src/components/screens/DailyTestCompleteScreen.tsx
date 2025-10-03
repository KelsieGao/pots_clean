import React from 'react';
import { CheckCircle, Home, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface DailyTestCompleteScreenProps {
  currentDay: number;
  totalDays: number;
  onBackToHome: () => void;
}

export function DailyTestCompleteScreen({ currentDay, totalDays, onBackToHome }: DailyTestCompleteScreenProps) {
  const isLastDay = currentDay > totalDays;
  const completedDay = isLastDay ? totalDays : currentDay - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Test Complete!</h2>
            <p className="text-gray-600">
              Day {completedDay} of {totalDays} is now complete. Great job!
            </p>
          </div>

          {/* Progress Update */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-green-900">Progress Update</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-green-800">
                <span>Baseline Testing</span>
                <span>{completedDay} of {totalDays} days complete</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedDay / totalDays) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Data Collection Info */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h3 className="font-medium text-teal-900 mb-2">What we recorded:</h3>
            <ul className="space-y-1 text-sm text-teal-800">
              <li>• Heart rate while sitting/lying (2 minutes)</li>
              <li>• Heart rate while standing (3 minutes)</li>
              <li>• Heart rate changes during transition</li>
              <li>• Timestamp and test conditions</li>
            </ul>
          </div>

          {!isLastDay && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Tomorrow:</h3>
              <p className="text-blue-800 text-sm">
                Come back at the same time tomorrow for Day {currentDay} of your baseline testing. 
                Consistency helps us get the most accurate results.
              </p>
            </div>
          )}

          <Button onClick={onBackToHome} size="lg" className="w-full">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>Your data is automatically saved and encrypted</p>
        </div>
      </div>
    </div>
  );
}