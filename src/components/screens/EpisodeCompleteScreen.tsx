import React from 'react';
import { CheckCircle, Home, Calendar, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Episode } from '../../types';

interface EpisodeCompleteScreenProps {
  episode: Episode;
  onBackToHome: () => void;
}

export function EpisodeCompleteScreen({ episode, onBackToHome }: EpisodeCompleteScreenProps) {
  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
    
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Episode Recorded</h2>
            <p className="text-gray-600">
              Your symptom episode has been successfully logged and saved.
            </p>
          </div>

          {/* Episode Summary */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h3 className="font-medium text-teal-900 mb-3">Episode Summary</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-teal-700">Duration:</span>
                <span className="font-medium text-teal-900">
                  {episode.endTime ? formatDuration(episode.startTime, episode.endTime) : 'Ongoing'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-teal-700">Time:</span>
                <span className="font-medium text-teal-900">
                  {formatTime(episode.startTime)} - {episode.endTime ? formatTime(episode.endTime) : 'Now'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-teal-700">Peak Severity:</span>
                <span className="font-medium text-teal-900">
                  {episode.severity}/10
                </span>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Symptoms Experienced:</h3>
            <div className="flex flex-wrap gap-2">
              {episode.symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {episode.notes && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Notes:</h3>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                {episode.notes}
              </p>
            </div>
          )}

          {/* Data Saved Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Data Automatically Saved</p>
                <p>This episode has been added to your symptom history and will be included in your medical report.</p>
              </div>
            </div>
          </div>

          <Button onClick={onBackToHome} size="lg" className="w-full">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>Your symptom data helps build a complete picture for your healthcare provider</p>
        </div>
      </div>
    </div>
  );
}