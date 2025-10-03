import React from 'react';
import { CheckCircle, FileText, Calendar, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface FiveDayCompleteScreenProps {
  onContinue: () => void;
}

export function FiveDayCompleteScreen({ onContinue }: FiveDayCompleteScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Baseline Complete!</h2>
            <p className="text-gray-600">
              Congratulations! You've completed all 5 days of baseline testing. 
              Your data is ready for analysis.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-3">What you accomplished:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">5</div>
                <div className="text-sm text-green-600">Daily Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">25</div>
                <div className="text-sm text-green-600">Minutes of Data</div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">What happens next:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FileText className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Report Generation</h4>
                  <p className="text-sm text-gray-600">
                    Your data will be analyzed and compiled into a comprehensive report for your healthcare provider.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Continue Tracking</h4>
                  <p className="text-sm text-gray-600">
                    You can continue logging symptoms and episodes to build a more complete picture.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Calendar className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Follow-up</h4>
                  <p className="text-sm text-gray-600">
                    Share your results with your doctor to discuss next steps in your care.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button onClick={onContinue} size="lg" className="w-full">
            Complete Follow-up Survey
          </Button>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>Your baseline data has been securely saved</p>
        </div>
      </div>
    </div>
  );
}