import React, { useState, useEffect } from 'react';
import { Bluetooth, Search, QrCode, HelpCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface DeviceConnectionScreenProps {
  onDeviceConnected: () => void;
  onBack: () => void;
  onSkip?: () => void;
}

export function DeviceConnectionScreen({ onDeviceConnected, onBack, onSkip }: DeviceConnectionScreenProps) {
  const [connectionState, setConnectionState] = useState<'initial' | 'searching' | 'connected'>('initial');
  const [showHelp, setShowHelp] = useState(false);

  const handleSearchForDevice = () => {
    setConnectionState('searching');
    
    // Simulate device search and connection
    setTimeout(() => {
      setConnectionState('connected');
      setTimeout(() => {
        onDeviceConnected();
      }, 2000);
    }, 3000);
  };

  const handleManualEntry = () => {
    // TODO: Implement manual code/QR entry
    console.log('Manual entry not implemented yet');
  };

  if (connectionState === 'searching') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="text-center space-y-6">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-teal-600 animate-pulse" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Searching for Device</h2>
              <p className="text-gray-600">
                Make sure your heart rate monitor is turned on and close by.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-sm text-gray-500">This may take a few moments...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (connectionState === 'connected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="text-center space-y-6">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Device Connected!</h2>
              <p className="text-gray-600">
                Your heart rate monitor is now linked. You're ready to start your daily test.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Bluetooth className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-green-900">HR Monitor Connected</p>
                  <p className="text-sm text-green-700">Ready to collect data</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Connect Your Monitor</h1>
        </div>

        <Card className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
              <Bluetooth className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Heart Rate Monitor Required</h2>
            <p className="text-gray-600">
              To run your daily sit/stand tests, you'll need to connect a heart rate monitor from your test kit.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleSearchForDevice}
              size="lg"
              className="w-full"
            >
              <Search className="w-5 h-5 mr-2" />
              Search for Device
            </Button>

            <Button 
              onClick={handleManualEntry}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Enter Code / Scan QR
            </Button>

            {onSkip && (
              <Button 
                onClick={onSkip}
                variant="ghost"
                size="lg"
                className="w-full"
              >
                Skip for Now
              </Button>
            )}
          </div>

          {/* Help Section */}
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => setShowHelp(!showHelp)}
              className="text-sm"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              Need help connecting?
            </Button>
          </div>

          {showHelp && (
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-medium mb-2">Troubleshooting Tips:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Make sure your monitor is charged and turned on</li>
                <li>• Keep the device within 3 feet of your phone</li>
                <li>• Check that Bluetooth is enabled on your phone</li>
                <li>• Try restarting the monitor if it's not found</li>
              </ul>
              <p className="mt-2 text-blue-600">
                Still having trouble? Contact support for assistance.
              </p>
            </div>
          )}
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>Compatible with most Bluetooth heart rate monitors</p>
        </div>
      </div>
    </div>
  );
}