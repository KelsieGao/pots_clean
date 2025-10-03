import React, { useState } from 'react';
import { ArrowLeft, Heart, Clock, MapPin, Mic, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface SymptomLogScreenProps {
  onLogSymptom: (symptomData: any) => void;
  onStartEpisode: (symptomData: any) => void;
  onBack: () => void;
  locationEnabled: boolean;
}

const commonSymptoms = [
  { id: 'dizziness', label: 'Dizziness', icon: '😵' },
  { id: 'lightheaded', label: 'Lightheaded', icon: '💫' },
  { id: 'fatigue', label: 'Fatigue', icon: '😴' },
  { id: 'palpitations', label: 'Palpitations', icon: '💓' },
  { id: 'chest-pain', label: 'Chest Pain', icon: '🫀' },
  { id: 'shortness-breath', label: 'Shortness of Breath', icon: '🫁' },
  { id: 'nausea', label: 'Nausea', icon: '🤢' },
  { id: 'headache', label: 'Headache', icon: '🤕' },
  { id: 'brain-fog', label: 'Brain Fog', icon: '🌫️' },
  { id: 'tremor', label: 'Tremor/Shaking', icon: '🤲' }
];

export function SymptomLogScreen({ onLogSymptom, onStartEpisode, onBack, locationEnabled }: SymptomLogScreenProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<number>(5);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [activityType, setActivityType] = useState('');
  const [otherDetails, setOtherDetails] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim()) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
      setShowCustomInput(false);
    }
  };

  const handleLogSymptom = () => {
    if (selectedSymptoms.length === 0) return;

    const combinedNotes = [timeOfDay, activityType, otherDetails]
      .filter(field => field.trim())
      .join(' | ');

    const symptomData = {
      symptoms: selectedSymptoms,
      severity,
      notes: combinedNotes || undefined,
      timeOfDay: timeOfDay.trim() || undefined,
      activityType: activityType.trim() || undefined,
      otherDetails: otherDetails.trim() || undefined,
      timestamp: new Date().toISOString()
    };

    onLogSymptom(symptomData);
  };

  const handleStartEpisode = () => {
    if (selectedSymptoms.length === 0) return;

    const combinedNotes = [timeOfDay, activityType, otherDetails]
      .filter(field => field.trim())
      .join(' | ');

    const symptomData = {
      symptoms: selectedSymptoms,
      severity,
      notes: combinedNotes || undefined,
      timeOfDay: timeOfDay.trim() || undefined,
      activityType: activityType.trim() || undefined,
      otherDetails: otherDetails.trim() || undefined,
      timestamp: new Date().toISOString()
    };

    onStartEpisode(symptomData);
  };

  const canSubmit = selectedSymptoms.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Log Symptoms</h1>
        </div>

        <Card className="space-y-6">
          <div className="text-center space-y-2">
            <Heart className="w-10 h-10 text-teal-600 mx-auto" />
            <h2 className="text-lg font-semibold text-gray-900">How are you feeling?</h2>
            <p className="text-gray-600 text-sm">
              Select the symptoms you're experiencing right now
            </p>
          </div>

          {/* Symptom Selection */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Select symptoms:</h3>
            <div className="grid grid-cols-2 gap-3">
              {commonSymptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => handleSymptomToggle(symptom.id)}
                  className={`p-3 text-left border-2 rounded-lg transition-colors ${
                    selectedSymptoms.includes(symptom.id)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{symptom.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{symptom.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Symptom Input */}
            {showCustomInput ? (
              <div className="space-y-3 p-4 border-2 border-teal-200 rounded-lg bg-teal-50">
                <Input
                  label="Custom Symptom"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  placeholder="Describe your symptom"
                />
                <div className="flex space-x-2">
                  <Button onClick={handleAddCustomSymptom} size="sm">
                    Add
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomSymptom('');
                    }}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowCustomInput(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Symptom
              </Button>
            )}
          </div>

          {/* Severity Scale */}
          {selectedSymptoms.length > 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity (1 = mild, 10 = severe)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">1</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">10</span>
                </div>
                <div className="text-center mt-2">
                  <span className="text-lg font-semibold text-teal-600">{severity}</span>
                </div>
              </div>

              {/* Time of Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time of Day
                </label>
                <input
                  type="text"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  placeholder="1:37pm, 11:55am, etc..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Activity Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Type
                </label>
                <input
                  type="text"
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  placeholder="e.g., Standing, Walking, Sitting, Exercise..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Other Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Details
                </label>
                <textarea
                  value={otherDetails}
                  onChange={(e) => setOtherDetails(e.target.value)}
                  placeholder="Any additional details, triggers, or context..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleLogSymptom}
                  disabled={!canSubmit}
                  size="lg"
                  className="w-full"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Log Symptoms
                </Button>
                
                <Button 
                  onClick={handleStartEpisode}
                  disabled={!canSubmit}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Start Episode Tracking
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                <p>Use "Log Symptoms" for quick entries</p>
                <p>Use "Start Episode" to track duration and changes</p>
              </div>
            </div>
          )}
        </Card>

        {locationEnabled && (
          <div className="text-center text-xs text-gray-500">
            <div className="flex items-center justify-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Location will be recorded with your symptoms</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}