import React, { useState } from 'react';
import { QrCode, HelpCircle, ArrowLeft, UserCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ClinicianCodeScreenProps {
  onCodeSubmit: (code: string) => void;
  onBack: () => void;
}

export function ClinicianCodeScreen({ onCodeSubmit, onBack }: ClinicianCodeScreenProps) {
  const [code, setCode] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleCodeChange = (value: string) => {
    // Allow only alphanumeric characters and limit to reasonable length
    const cleanCode = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 12);
    setCode(cleanCode);
  };

  const handleSubmit = () => {
    if (code.length >= 6) {
      onCodeSubmit(code);
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === 'CLEAR') {
      setCode('');
    } else if (key === 'DELETE') {
      setCode(prev => prev.slice(0, -1));
    } else {
      handleCodeChange(code + key);
    }
  };

  const keypadKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['CLEAR', '0', 'DELETE']
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Clinician Access</h1>
        </div>

        <Card className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Enter Clinician Code</h2>
            <p className="text-gray-600">
              Enter your unique clinician access code to view and manage patient data.
            </p>

            {/* Code Display */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <div className="text-2xl font-mono tracking-widest text-center min-h-[2rem] flex items-center justify-center">
                {code || <span className="text-gray-400">Enter code</span>}
              </div>
            </div>

            {/* QR Code Option */}
            <Button variant="outline" className="w-full">
              <QrCode className="w-5 h-5 mr-2" />
              Scan QR Code Instead
            </Button>
          </div>

          {/* Keypad */}
          <div className="space-y-3">
            {keypadKeys.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-3 gap-3">
                {row.map((key) => (
                  <Button
                    key={key}
                    variant="outline"
                    onClick={() => handleKeyPress(key)}
                    className="h-12 text-lg font-semibold"
                  >
                    {key === 'DELETE' ? '⌫' : key}
                  </Button>
                ))}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={code.length < 6}
            size="lg"
            className="w-full"
          >
            Enter
          </Button>

          {/* Help */}
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => setShowHelp(!showHelp)}
              className="text-sm"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              Need help with your code?
            </Button>
          </div>

          {showHelp && (
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-medium mb-2">Your clinician code can be found:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• In your clinic administrator portal</li>
                <li>• On your staff access card</li>
                <li>• In your welcome email from the system</li>
              </ul>
              <p className="mt-2 text-blue-600">
                Contact your clinic administrator if you cannot locate your code.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}