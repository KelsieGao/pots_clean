import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { useAppState } from '../../hooks/useAppState';

interface SitLieDownScreenProps {
  onNext: () => void;
  onCancel: () => void;
}

export function SitLieDownScreen({ onNext, onCancel }: SitLieDownScreenProps) {
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const { state, showBPPrompt, recordBPReading, updateState } = useAppState();
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');

  useEffect(() => {
    // Auto-start the timer when component mounts
    setIsActive(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeRemaining > 0 && !state.isBPPromptVisible) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          const newTime = time - 1;
          // Pause at 1 minute (60 seconds remaining) for BP reading
          if (newTime === 60 && !state.isBPPromptVisible) {
            showBPPrompt('lying');
            return newTime; // Don't decrement further
          }
          return newTime;
        });
      }, 1000);
    } else if (timeRemaining === 0 && !state.isBPPromptVisible) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, state.isBPPromptVisible, showBPPrompt]);

  const handleBPSubmit = () => {
    const systolic = parseInt(bpSystolic);
    const diastolic = parseInt(bpDiastolic);
    
    if (systolic && diastolic && systolic > 0 && diastolic > 0) {
      recordBPReading(systolic, diastolic, 'lying');
      setBpSystolic('');
      setBpDiastolic('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((120 - timeRemaining) / 120) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Cancel Button */}
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onCancel} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <X className="w-4 h-4 mr-1" />
            Cancel Test
          </Button>
        </div>

        <Card className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Sit or Lie Down</h2>
            <p className="text-gray-600">
              Get comfortable in a sitting or lying position. Stay relaxed and breathe normally.
            </p>
          </div>

          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-teal-600">
              {formatTime(timeRemaining)}
            </div>
            
            {/* Progress Ring */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#0d9488"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h3 className="font-medium text-teal-900 mb-2">While you wait:</h3>
            <ul className="space-y-1 text-sm text-teal-800">
              <li>• Stay in your comfortable position</li>
              <li>• Breathe normally and try to relax</li>
              <li>• Your heart rate monitor is recording data</li>
              <li>• Avoid talking or moving unnecessarily</li>
            </ul>
          </div>

          {timeRemaining === 0 ? (
            <Button onClick={onNext} size="lg" className="w-full">
              <ArrowRight className="w-5 h-5 mr-2" />
              Time to Stand
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Please remain seated/lying down...
              </p>
            </div>
          )}
        </Card>

        {/* Blood Pressure Prompt */}
        {state.isBPPromptVisible && state.currentBPPosition === 'lying' && (
          <Card className="border-2 border-blue-500 bg-blue-50">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-900">Blood Pressure Reading</h3>
                <p className="text-blue-800 text-sm">
                  Please take your blood pressure reading now while remaining seated/lying down.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Systolic (top number)"
                  type="number"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  placeholder="120"
                  min="50"
                  max="250"
                />
                <Input
                  label="Diastolic (bottom number)"
                  type="number"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  placeholder="80"
                  min="30"
                  max="150"
                />
              </div>
              
              <Button 
                onClick={handleBPSubmit}
                disabled={!bpSystolic || !bpDiastolic}
                size="lg"
                className="w-full"
              >
                Record Blood Pressure
              </Button>
            </div>
          </Card>
        )}

        <div className="text-center text-xs text-gray-500">
          <p>Step 1 of 2 • Recording baseline heart rate</p>
        </div>
      </div>
    </div>
  );
}