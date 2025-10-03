import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';

interface ReportGenerationScreenProps {
  onReportReady: () => void;
}

export function ReportGenerationScreen({ onReportReady }: ReportGenerationScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Analyzing heart rate data...');

  const steps = [
    'Analyzing heart rate data...',
    'Processing symptom patterns...',
    'Comparing COMPASS-31 results...',
    'Generating clinical insights...',
    'Formatting medical report...',
    'Finalizing document...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        
        if (stepIndex < steps.length) {
          setCurrentStep(steps[stepIndex]);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onReportReady();
          }, 1000);
          return 100;
        }
        
        return newProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onReportReady]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Generating Your Report</h2>
            <p className="text-gray-600">
              We're analyzing your 5-day baseline data and creating a comprehensive medical report.
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-teal-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-700">
              {progress < 100 ? (
                <Clock className="w-4 h-4 text-teal-600 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
              <span>{currentStep}</span>
            </div>
          </div>

          {/* What's being analyzed */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h3 className="font-medium text-teal-900 mb-2">What we're analyzing:</h3>
            <ul className="space-y-1 text-sm text-teal-800">
              <li>• 5 days of heart rate measurements</li>
              <li>• Symptom episodes and patterns</li>
              <li>• COMPASS-31 questionnaire responses</li>
              <li>• Medication effects and timing</li>
              <li>• Clinical indicators for POTS</li>
            </ul>
          </div>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>This may take a few moments to complete</p>
        </div>
      </div>
    </div>
  );
}