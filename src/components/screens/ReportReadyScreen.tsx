import React from 'react';
import { FileText, Download, Mail, Eye, Share } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ReportReadyScreenProps {
  onViewReport: () => void;
  onDownloadReport: () => void;
  onEmailReport: () => void;
  onShareReport: () => void;
}

export function ReportReadyScreen({ 
  onViewReport, 
  onDownloadReport, 
  onEmailReport, 
  onShareReport 
}: ReportReadyScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Your Report is Ready!</h2>
            <p className="text-gray-600">
              Your comprehensive POTS assessment report has been generated and is ready to share with your healthcare provider.
            </p>
          </div>

          {/* Report Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-3">Report Summary:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-green-700">5</div>
                <div className="text-green-600">Days of Data</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-700">25</div>
                <div className="text-green-600">HR Measurements</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-700">18</div>
                <div className="text-green-600">Survey Questions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-700">12</div>
                <div className="text-green-600">Pages</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={onViewReport} size="lg" className="w-full">
              <Eye className="w-5 h-5 mr-2" />
              Preview Report
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={onDownloadReport} variant="outline" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </Button>
              
              <Button onClick={onEmailReport} variant="outline" size="lg">
                <Mail className="w-5 h-5 mr-2" />
                Email Report
              </Button>
            </div>

            <Button onClick={onShareReport} variant="secondary" size="lg" className="w-full">
              <Share className="w-5 h-5 mr-2" />
              Share with Provider
            </Button>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Important:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• This report is for medical consultation only</li>
              <li>• Share with your healthcare provider for diagnosis</li>
              <li>• Keep a copy for your medical records</li>
              <li>• Results should be interpreted by a medical professional</li>
            </ul>
          </div>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>Report generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}