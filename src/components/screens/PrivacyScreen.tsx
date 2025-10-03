import React, { useState } from 'react';
import { Shield, Lock, Eye, Trash2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface PrivacyScreenProps {
  onAgree: () => void;
  onBack: () => void;
}

export function PrivacyScreen({ onAgree, onBack }: PrivacyScreenProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Privacy & Data Security</h1>
        </div>

        <Card className="space-y-6">
          <div className="text-center space-y-2">
            <Shield className="w-12 h-12 text-teal-600 mx-auto" />
            <h2 className="text-lg font-semibold text-gray-900">Your Data is Protected</h2>
            <p className="text-gray-600">
              We take your privacy seriously. Here's how we protect your health information.
            </p>
          </div>

          {/* Privacy Features */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Lock className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Encrypted Storage</h3>
                <p className="text-sm text-gray-600">
                  All your data is encrypted both in transit and at rest using industry-standard security.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Eye className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Limited Access</h3>
                <p className="text-sm text-gray-600">
                  Only you and healthcare providers you authorize can access your data. We never sell your information.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Trash2 className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Your Control</h3>
                <p className="text-sm text-gray-600">
                  You can delete your data at any time. You control who sees your information and for how long.
                </p>
              </div>
            </div>
          </div>

          {/* Important Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-900">Important Medical Disclaimer</h3>
                <p className="text-sm text-amber-800 mt-1">
                  This app is a monitoring tool and is <strong>not intended for diagnosis</strong>. 
                  Always consult with your healthcare provider for medical decisions. 
                  Do not use this app for emergency situations.
                </p>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="space-y-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">
                I understand how my data will be used and protected. I agree to the privacy policy 
                and acknowledge this is not a diagnostic tool.
              </span>
            </label>

            <Button 
              onClick={onAgree}
              disabled={!agreed}
              size="lg"
              className="w-full"
            >
              I Agree - Continue
            </Button>
          </div>

          {/* Links */}
          <div className="text-center space-x-4 text-sm">
            <button className="text-teal-600 hover:text-teal-700 underline">
              Full Privacy Policy
            </button>
            <button className="text-teal-600 hover:text-teal-700 underline">
              Terms of Service
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}