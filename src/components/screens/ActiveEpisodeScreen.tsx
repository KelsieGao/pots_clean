import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Heart, MapPin, Square } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Episode } from '../../types';

interface ActiveEpisodeScreenProps {
  episode: Episode;
  onEndEpisode: (notes?: string) => void;
  onUpdateEpisode: (updates: Partial<Episode>) => void;
  onBack: () => void;
  locationEnabled: boolean;
}

export function ActiveEpisodeScreen({ 
  episode, 
  onEndEpisode, 
  onUpdateEpisode, 
  onBack, 
  locationEnabled 
}: ActiveEpisodeScreenProps) {
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState(episode.notes || '');
  const [currentSeverity, setCurrentSeverity] = useState(episode.severity || 5);

  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(episode.startTime);
      const now = new Date();
      const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
      setDuration(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [episode.startTime]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeverityUpdate = (newSeverity: number) => {
    setCurrentSeverity(newSeverity);
    onUpdateEpisode({ severity: newSeverity });
  };

  const handleEndEpisode = () => {
    onEndEpisode(notes.trim() || undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Active Episode</h1>
        </div>

        {/* Episode Status Card */}
        <Card className="space-y-6 border-l-4 border-l-red-500">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Episode in Progress</h2>
            <div className="text-3xl font-bold text-red-600">
              {formatDuration(duration)}
            </div>
          </div>

          {/* Current Symptoms */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Current Symptoms:</h3>
            <div className="flex flex-wrap gap-2">
              {episode.symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          {/* Severity Tracker */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Severity (1 = mild, 10 = severe)
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentSeverity}
                  onChange={(e) => handleSeverityUpdate(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-500">10</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-lg font-semibold text-red-600">{currentSeverity}</span>
              </div>
            </div>
          </div>

          {/* Episode Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Episode Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are your symptoms changing? Any triggers or patterns you notice?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleEndEpisode}
              variant="secondary"
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Square className="w-5 h-5 mr-2" />
              End Episode
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="space-y-4">
          <h3 className="font-medium text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="text-sm">
              <Heart className="w-4 h-4 mr-1" />
              Check HR
            </Button>
            <Button variant="outline" size="sm" className="text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              Update Location
            </Button>
          </div>
        </Card>

        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            <strong>Feeling worse or having severe symptoms?</strong> End the episode and seek medical attention if needed. This app is for monitoring only.
          </p>
        </div>

        {locationEnabled && (
          <div className="text-center text-xs text-gray-500">
            <div className="flex items-center justify-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Location tracking active during episode</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}