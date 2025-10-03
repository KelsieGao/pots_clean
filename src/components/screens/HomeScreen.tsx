import React from 'react';
import { Calendar, Heart, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface HomeScreenProps {
  currentDay: number;
  totalDays: number;
  dailyTests: any[];
  onStartTest: () => void;
  onSymptoms: () => void;
}

export function HomeScreen({ currentDay, totalDays, dailyTests, onStartTest, onSymptoms }: HomeScreenProps) {
  const todayCompleted = dailyTests.some(test => {
    const today = new Date().toISOString().split('T')[0];
    return test.date === today && test.completed;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">POTSITIVE Tracker</h1>
          <p className="text-gray-600">Day {currentDay} of {totalDays}</p>
        </div>

        {/* Progress Card */}
        <Card className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-900">Baseline Testing</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.max(0, currentDay - 1)} of {totalDays} days complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-teal-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(Math.max(0, currentDay - 1) / totalDays) * 100}%` }}
              ></div>
            </div>
          </div>

          {todayCompleted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Today's test completed!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Great job! Come back tomorrow for your next test.
              </p>
            </div>
          ) : (
            <Button onClick={onStartTest} size="lg" className="w-full">
              <Activity className="w-5 h-5 mr-2" />
              Start Daily Test
            </Button>
          )}
        </Card>

        {/* Secondary Actions */}
        <Card className="space-y-4">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-900">Symptom Tracking</h2>
          </div>
          
          <p className="text-gray-600 text-sm">
            Log symptoms as they happen throughout your day
          </p>
          
          <Button onClick={onSymptoms} variant="outline" size="lg" className="w-full">
            <Heart className="w-5 h-5 mr-2" />
            Log Symptoms
          </Button>
        </Card>

        {/* Daily Tests History */}
        {dailyTests.length > 0 && (
          <Card className="space-y-4">
            <h3 className="font-medium text-gray-900">Completed Tests</h3>
            <div className="space-y-2">
              {dailyTests.map((test, index) => (
                <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 font-medium text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Day {index + 1}</p>
                      <p className="text-sm text-gray-600">{new Date(test.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="text-center text-xs text-gray-500">
          <p>Complete your daily test at the same time each day for best results</p>
        </div>
      </div>
    </div>
  );
}