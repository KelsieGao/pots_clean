import React from 'react';
import { Play, ArrowLeft, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface IntroToTestScreenProps {
  currentDay: number;
  totalDays: number;
  onStartTest: () => void;
  onBack: () => void;
}

export function IntroToTestScreen({ currentDay, totalDays, onStartTest, onBack }: IntroToTestScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Daily Test - Day {currentDay}</h1>
        </div>

        <Card className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Sit/Stand Test</h2>
            <p className="text-gray-600">
              We'll guide you through a simple test to measure how your heart rate responds to position changes.
            </p>
          </div>

          {/* Test Overview */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h3 className="font-medium text-teal-900 mb-3">What we'll do:</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-800 text-sm font-medium">1</span>
                </div>
                <p className="text-teal-800 text-sm">Sit or lie down comfortably for 2 minutes</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-800 text-sm font-medium">2</span>
                </div>
                <p className="text-teal-800 text-sm">Take blood pressure reading at 1-minute mark while seated/lying</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-800 text-sm font-medium">3</span>
                </div>
                <p className="text-teal-800 text-sm">Stand up and remain standing for 3 minutes</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-800 text-sm font-medium">4</span>
                </div>
                <p className="text-teal-800 text-sm">Take blood pressure reading at 3-minute mark while standing</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-800 text-sm font-medium">5</span>
                </div>
                <p className="text-teal-800 text-sm">Your heart rate monitor will record the data continuously</p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Before we start:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Make sure your heart rate monitor is connected</li>
              <li>• Have your blood pressure cuff securely attached to your bicep and ready for use</li>
              <li>• Find a quiet space where you won't be interrupted</li>
              <li>• Have a chair or comfortable surface nearby</li>
              <li>• The test takes about 6-7 minutes total (including BP measurements)</li>
            </ul>
          </div>

          <Button onClick={onStartTest} size="lg" className="w-full">
            <Play className="w-5 h-5 mr-2" />
            Start Test
          </Button>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>Day {currentDay} of {totalDays} • Complete at the same time each day</p>
        </div>
      </div>
    </div>
  );
}