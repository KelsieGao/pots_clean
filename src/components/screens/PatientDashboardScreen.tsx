import React, { useState } from 'react';
import { ArrowLeft, Heart, Activity, TrendingUp, FileText, Clock, MapPin, Gauge } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { BPReading } from '../../types';
import { DailyTestHeartRateGraph } from '../charts/DailyTestHeartRateGraph';

// Real heart rate data from provided dataset
const heartRateData = [
  { minute: 1, heartRate: 78.53 },
  { minute: 2, heartRate: 78.45 },
  { minute: 3, heartRate: 78.54 },
  { minute: 4, heartRate: 78.63 },
  { minute: 5, heartRate: 78.72 },
  { minute: 6, heartRate: 78.80 },
  { minute: 7, heartRate: 78.89 },
  { minute: 8, heartRate: 78.98 },
  { minute: 9, heartRate: 79.07 },
  { minute: 10, heartRate: 79.15 },
  { minute: 11, heartRate: 79.24 },
  { minute: 12, heartRate: 79.33 },
  { minute: 13, heartRate: 79.42 },
  { minute: 14, heartRate: 79.50 },
  { minute: 15, heartRate: 79.59 },
  { minute: 16, heartRate: 79.68 },
  { minute: 17, heartRate: 79.76 },
  { minute: 18, heartRate: 79.85 },
  { minute: 19, heartRate: 79.94 },
  { minute: 20, heartRate: 80.03 },
  { minute: 21, heartRate: 80.11 },
  { minute: 22, heartRate: 80.20 },
  { minute: 23, heartRate: 80.29 },
  { minute: 24, heartRate: 80.38 },
  { minute: 25, heartRate: 80.46 },
  { minute: 26, heartRate: 80.55 },
  { minute: 27, heartRate: 80.64 },
  { minute: 28, heartRate: 80.73 },
  { minute: 29, heartRate: 80.81 },
  { minute: 30, heartRate: 80.90 },
  { minute: 31, heartRate: 80.99 },
  { minute: 32, heartRate: 81.08 },
  { minute: 33, heartRate: 81.16 },
  { minute: 34, heartRate: 81.25 },
  { minute: 35, heartRate: 81.34 },
  { minute: 36, heartRate: 81.43 },
  { minute: 37, heartRate: 81.51 },
  { minute: 38, heartRate: 81.60 },
  { minute: 39, heartRate: 81.69 },
  { minute: 40, heartRate: 81.78 },
  { minute: 41, heartRate: 81.86 },
  { minute: 42, heartRate: 81.95 },
  { minute: 43, heartRate: 82.04 },
  { minute: 44, heartRate: 82.13 },
  { minute: 45, heartRate: 82.21 },
  { minute: 46, heartRate: 82.30 },
  { minute: 47, heartRate: 82.39 },
  { minute: 48, heartRate: 82.48 },
  { minute: 49, heartRate: 82.56 },
  { minute: 50, heartRate: 82.65 },
  { minute: 51, heartRate: 82.74 },
  { minute: 52, heartRate: 82.83 },
  { minute: 53, heartRate: 82.91 },
  { minute: 54, heartRate: 83.00 },
  { minute: 55, heartRate: 75.00 },
  { minute: 56, heartRate: 67.00 },
  { minute: 57, heartRate: 59.00 },
  { minute: 58, heartRate: 51.00 },
  { minute: 59, heartRate: 71.11 },
  { minute: 60, heartRate: 66.74 },
  { minute: 61, heartRate: 62.37 },
  { minute: 62, heartRate: 58.00 },
  { minute: 63, heartRate: 58.75 },
  { minute: 64, heartRate: 59.50 },
  { minute: 65, heartRate: 60.25 },
  { minute: 66, heartRate: 61.00 },
  { minute: 67, heartRate: 64.00 },
  { minute: 68, heartRate: 67.00 },
  { minute: 69, heartRate: 70.00 },
  { minute: 70, heartRate: 73.00 },
  { minute: 71, heartRate: 76.00 },
  { minute: 72, heartRate: 80.00 },
  { minute: 73, heartRate: 84.00 },
  { minute: 74, heartRate: 88.00 },
  { minute: 75, heartRate: 84.84 },
  { minute: 76, heartRate: 81.69 },
  { minute: 77, heartRate: 78.53 },
  { minute: 78, heartRate: 78.45 },
  { minute: 79, heartRate: 78.39 },
  { minute: 80, heartRate: 78.32 },
  { minute: 81, heartRate: 78.25 },
  { minute: 82, heartRate: 78.18 },
  { minute: 83, heartRate: 78.11 },
  { minute: 84, heartRate: 78.04 },
  { minute: 85, heartRate: 77.98 },
  { minute: 86, heartRate: 77.91 },
  { minute: 87, heartRate: 77.84 },
  { minute: 88, heartRate: 77.77 },
  { minute: 89, heartRate: 77.70 },
  { minute: 90, heartRate: 77.64 },
  { minute: 91, heartRate: 77.57 },
  { minute: 92, heartRate: 77.50 },
  { minute: 93, heartRate: 77.43 },
  { minute: 94, heartRate: 77.36 },
  { minute: 95, heartRate: 77.29 },
  { minute: 96, heartRate: 77.23 },
  { minute: 97, heartRate: 77.16 },
  { minute: 98, heartRate: 77.09 },
  { minute: 99, heartRate: 77.02 },
  { minute: 100, heartRate: 76.95 },
  { minute: 101, heartRate: 76.89 },
  { minute: 102, heartRate: 76.82 },
  { minute: 103, heartRate: 76.75 },
  { minute: 104, heartRate: 76.68 },
  { minute: 105, heartRate: 76.61 },
  { minute: 106, heartRate: 76.55 },
  { minute: 107, heartRate: 76.48 },
  { minute: 108, heartRate: 76.41 },
  { minute: 109, heartRate: 76.34 },
  { minute: 110, heartRate: 76.27 },
  { minute: 111, heartRate: 76.20 },
  { minute: 112, heartRate: 76.14 },
  { minute: 113, heartRate: 76.07 },
  { minute: 114, heartRate: 76.00 },
  { minute: 115, heartRate: 75.20 },
  { minute: 116, heartRate: 74.40 },
  { minute: 117, heartRate: 73.60 },
  { minute: 118, heartRate: 72.80 },
  { minute: 119, heartRate: 72.00 },
  { minute: 120, heartRate: 72.50 },
  { minute: 121, heartRate: 73.00 },
  { minute: 122, heartRate: 72.00 },
  { minute: 123, heartRate: 71.00 },
  { minute: 124, heartRate: 70.00 },
  { minute: 125, heartRate: 69.00 },
  { minute: 126, heartRate: 69.20 },
  { minute: 127, heartRate: 69.40 },
  { minute: 128, heartRate: 69.60 },
  { minute: 129, heartRate: 69.80 },
  { minute: 130, heartRate: 70.00 },
  { minute: 131, heartRate: 70.11 },
  { minute: 132, heartRate: 70.22 },
  { minute: 133, heartRate: 70.33 },
  { minute: 134, heartRate: 70.44 },
  { minute: 135, heartRate: 70.56 },
  { minute: 136, heartRate: 70.67 },
  { minute: 137, heartRate: 70.78 },
  { minute: 138, heartRate: 70.89 },
  { minute: 139, heartRate: 71.00 },
  { minute: 140, heartRate: 70.75 },
  { minute: 141, heartRate: 70.50 },
  { minute: 142, heartRate: 70.25 },
  { minute: 143, heartRate: 70.00 },
  { minute: 144, heartRate: 71.98 },
  { minute: 145, heartRate: 73.97 },
  { minute: 146, heartRate: 75.95 },
  { minute: 147, heartRate: 77.93 },
  { minute: 148, heartRate: 79.92 },
  { minute: 149, heartRate: 79.00 },
  { minute: 150, heartRate: 78.55 },
  { minute: 151, heartRate: 79.15 },
  { minute: 152, heartRate: 80.64 },
  { minute: 153, heartRate: 74.77 },
  { minute: 154, heartRate: 80.91 },
  { minute: 155, heartRate: 76.23 },
  { minute: 156, heartRate: 73.25 },
  { minute: 157, heartRate: 79.67 },
  { minute: 158, heartRate: 76.50 },
  { minute: 159, heartRate: 84.40 },
  { minute: 160, heartRate: 86.46 },
  { minute: 161, heartRate: 87.67 },
  { minute: 162, heartRate: 83.91 },
  { minute: 163, heartRate: 88.25 },
  { minute: 164, heartRate: 90.17 },
  { minute: 165, heartRate: 88.77 },
  { minute: 166, heartRate: 89.67 },
  { minute: 167, heartRate: 90.58 },
  { minute: 168, heartRate: 91.09 },
  { minute: 169, heartRate: 97.75 },
  { minute: 170, heartRate: 87.85 },
  { minute: 171, heartRate: 83.33 },
  { minute: 172, heartRate: 82.64 },
  { minute: 173, heartRate: 82.00 },
  { minute: 174, heartRate: 81.08 },
  { minute: 175, heartRate: 85.09 },
  { minute: 176, heartRate: 95.55 },
  { minute: 177, heartRate: 96.08 },
  { minute: 178, heartRate: 95.67 },
  { minute: 179, heartRate: 96.08 },
  { minute: 180, heartRate: 95.00 },
  { minute: 181, heartRate: 96.50 },
  { minute: 182, heartRate: 99.42 },
  { minute: 183, heartRate: 105.33 },
  { minute: 184, heartRate: 106.25 },
  { minute: 185, heartRate: 112.08 },
  { minute: 186, heartRate: 104.00 },
  { minute: 187, heartRate: 84.31 },
  { minute: 188, heartRate: 81.42 },
  { minute: 189, heartRate: 79.67 },
  { minute: 190, heartRate: 82.36 },
  { minute: 191, heartRate: 81.00 },
  { minute: 192, heartRate: 104.67 },
  { minute: 193, heartRate: 122.92 },
  { minute: 194, heartRate: 123.15 },
  { minute: 195, heartRate: 119.73 },
  { minute: 196, heartRate: 119.67 },
  { minute: 197, heartRate: 116.50 },
  { minute: 198, heartRate: 118.46 },
  { minute: 199, heartRate: 118.36 },
  { minute: 200, heartRate: 117.33 },
  { minute: 201, heartRate: 121.50 },
  { minute: 202, heartRate: 118.42 },
  { minute: 203, heartRate: 123.50 },
  { minute: 204, heartRate: 104.83 },
  { minute: 205, heartRate: 97.00 },
  { minute: 206, heartRate: 92.17 },
  { minute: 207, heartRate: 94.75 },
  { minute: 208, heartRate: 90.77 },
  { minute: 209, heartRate: 122.27 },
  { minute: 210, heartRate: 148.08 },
  { minute: 211, heartRate: 153.54 },
  { minute: 212, heartRate: 146.33 },
  { minute: 213, heartRate: 137.00 },
  { minute: 214, heartRate: 132.75 },
  { minute: 215, heartRate: 131.25 },
  { minute: 216, heartRate: 133.67 },
  { minute: 217, heartRate: 144.50 },
  { minute: 218, heartRate: 149.54 },
  { minute: 219, heartRate: 153.36 },
  { minute: 220, heartRate: 115.95 },
  { minute: 221, heartRate: 78.53 },
  { minute: 222, heartRate: 78.45 },
  { minute: 223, heartRate: 78.20 },
  { minute: 224, heartRate: 77.94 },
  { minute: 225, heartRate: 77.68 },
  { minute: 226, heartRate: 77.42 },
  { minute: 227, heartRate: 77.17 },
  { minute: 228, heartRate: 76.91 },
  { minute: 229, heartRate: 76.65 },
  { minute: 230, heartRate: 76.39 },
  { minute: 231, heartRate: 76.14 },
  { minute: 232, heartRate: 75.88 },
  { minute: 233, heartRate: 75.62 },
  { minute: 234, heartRate: 75.36 },
  { minute: 235, heartRate: 75.11 },
  { minute: 236, heartRate: 74.85 },
  { minute: 237, heartRate: 74.59 },
  { minute: 238, heartRate: 74.33 },
  { minute: 239, heartRate: 74.07 },
  { minute: 240, heartRate: 73.82 }
];

interface PatientData {
  id: string;
  name: string;
  patientCode: string;
  averageHeartRate: number;
  episodeCount: number;
  heartRateRange: { min: number; max: number };
  episodes: {
    id: string;
    date: string;
    time: string;
    duration: string;
    symptoms: string[];
    severity: number;
    timeOfDay?: string;
    activityType?: string;
    otherDetails?: string;
  }[];
  bpReadings: BPReading[];
  vossComparison: {
    baselineScore: number;
    followUpScore: number;
    scoreDifference: number;
    interpretation: string;
  };
}

interface PatientDashboardScreenProps {
  patientId: string;
  onBack: () => void;
  patientDailyTests: Record<string, any[]>;
}

const mockPatientData: PatientData = {
  id: '3',
  name: 'Emily Rodriguez',
  patientCode: 'ER2024003',
  averageHeartRate: Math.round(heartRateData.reduce((sum, d) => sum + d.heartRate, 0) / heartRateData.length),
  episodeCount: 5,
  heartRateRange: { 
    min: Math.round(Math.min(...heartRateData.map(d => d.heartRate))), 
    max: Math.round(Math.max(...heartRateData.map(d => d.heartRate))) 
  },
  episodes: [
    {
      id: 'episode-1',
      date: '2024-01-15',
      time: '09:30 AM',
      duration: '18 min',
      symptoms: ['Dizziness', 'Palpitations'],
      severity: 7,
      timeOfDay: 'Morning',
      activityType: 'Standing up quickly',
      otherDetails: 'Felt worse after standing for 10+ minutes in the kitchen'
    },
    {
      id: 'episode-2',
      date: '2024-01-16',
      time: '01:15 PM',
      duration: '25 min',
      symptoms: ['Lightheaded', 'Fatigue'],
      severity: 6,
      timeOfDay: 'After lunch',
      activityType: 'Walking upstairs',
      otherDetails: 'Symptoms started halfway up the stairs, had to sit down'
    },
    {
      id: 'episode-3',
      date: '2024-01-17',
      time: '07:45 PM',
      duration: '32 min',
      symptoms: ['Dizziness', 'Brain Fog', 'Tremor'],
      severity: 8,
      timeOfDay: 'Evening',
      activityType: 'After exercise',
      otherDetails: 'Occurred 30 minutes after light yoga session'
    },
    {
      id: 'episode-4',
      date: '2024-01-18',
      time: '10:20 AM',
      duration: '15 min',
      symptoms: ['Palpitations', 'Chest Pain'],
      severity: 7,
      timeOfDay: 'Late morning',
      activityType: 'Sitting to standing',
      otherDetails: 'Heart racing feeling lasted longer than usual'
    },
    {
      id: 'episode-5',
      date: '2024-01-19',
      time: '03:30 PM',
      duration: '22 min',
      symptoms: ['Dizziness', 'Shortness of Breath'],
      severity: 6,
      timeOfDay: 'Afternoon',
      activityType: 'Walking outside',
      otherDetails: 'Hot weather may have been a contributing factor'
    }
  ],
  bpReadings: [
    { timestamp: '2024-01-15T09:00:00Z', systolic: 110, diastolic: 70, position: 'lying' },
    { timestamp: '2024-01-15T09:03:00Z', systolic: 125, diastolic: 85, position: 'standing' },
    { timestamp: '2024-01-16T09:00:00Z', systolic: 108, diastolic: 68, position: 'lying' },
    { timestamp: '2024-01-16T09:03:00Z', systolic: 130, diastolic: 88, position: 'standing' },
    { timestamp: '2024-01-17T09:00:00Z', systolic: 112, diastolic: 72, position: 'lying' },
    { timestamp: '2024-01-17T09:03:00Z', systolic: 128, diastolic: 86, position: 'standing' },
    { timestamp: '2024-01-18T09:00:00Z', systolic: 115, diastolic: 75, position: 'lying' },
    { timestamp: '2024-01-18T09:03:00Z', systolic: 135, diastolic: 92, position: 'standing' },
    { timestamp: '2024-01-19T09:00:00Z', systolic: 109, diastolic: 69, position: 'lying' },
    { timestamp: '2024-01-19T09:03:00Z', systolic: 132, diastolic: 89, position: 'standing' }
  ],
  vossComparison: {
    baselineScore: 42,
    followUpScore: 0, // No follow-up survey taken
    scoreDifference: 0,
    interpretation: 'Baseline VOSS score of 42/90 indicates moderate orthostatic symptom burden. No follow-up survey was completed.'
  }
};

export function PatientDashboardScreen({ patientId, onBack, patientDailyTests }: PatientDashboardScreenProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'compass' | 'episodes'>('dashboard');
  const patient = mockPatientData; // In real app, would fetch by patientId

  // Get daily tests for this patient
  const patientTests = patientDailyTests[patientId] || [];

  // Calculate BP averages
  const allBPReadings = patientTests.flatMap(test => test.bpReadings || []);
  const lyingBP = allBPReadings.filter(bp => bp.position === 'lying');
  const standingBP = allBPReadings.filter(bp => bp.position === 'standing');
  
  const avgLyingBP = lyingBP.length > 0 ? {
    systolic: Math.round(lyingBP.reduce((sum, bp) => sum + bp.systolic, 0) / lyingBP.length),
    diastolic: Math.round(lyingBP.reduce((sum, bp) => sum + bp.diastolic, 0) / lyingBP.length)
  } : null;
  
  const avgStandingBP = standingBP.length > 0 ? {
    systolic: Math.round(standingBP.reduce((sum, bp) => sum + bp.systolic, 0) / standingBP.length),
    diastolic: Math.round(standingBP.reduce((sum, bp) => sum + bp.diastolic, 0) / standingBP.length)
  } : null;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Heart className="w-5 h-5 text-teal-600" />
            <h3 className="font-medium text-gray-900">Average Heart Rate</h3>
          </div>
          <div className="text-2xl font-bold text-teal-600">{patient.averageHeartRate} BPM</div>
          <div className="text-sm text-gray-600">5-day monitoring period</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Gauge className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-gray-900">Average BP (Lying)</h3>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {avgLyingBP ? `${avgLyingBP.systolic}/${avgLyingBP.diastolic}` : 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Baseline measurements</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Gauge className="w-5 h-5 text-orange-600" />
            <h3 className="font-medium text-gray-900">Average BP (Standing)</h3>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {avgStandingBP ? `${avgStandingBP.systolic}/${avgStandingBP.diastolic}` : 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Orthostatic measurements</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Activity className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-gray-900">Episodes Logged</h3>
          </div>
          <div className="text-2xl font-bold text-red-600">{patient.episodeCount}</div>
          <div className="text-sm text-gray-600">During monitoring period</div>
        </Card>

      </div>

      {/* Blood Pressure Trends */}
      {patientTests.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Test Results</h3>
          <div className="space-y-6">
            {patientTests.map((test, index) => (
              <DailyTestHeartRateGraph 
                key={test.id} 
                dailyTest={test} 
                dayNumber={index + 1} 
              />
            ))}
          </div>
        </Card>
      )}

      {/* Heart Rate & Episode Graph */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Heart Rate Over Time</h3>
        <div className="relative h-80 bg-gray-50 rounded-lg border-2 border-gray-200">
          {/* Y-axis */}
          <div className="absolute left-4 top-4 bottom-16 flex flex-col justify-between">
            <span className="text-xs text-gray-600 font-medium">200</span>
            <span className="text-xs text-gray-600 font-medium">150</span>
            <span className="text-xs text-gray-600 font-medium">100</span>
            <span className="text-xs text-gray-600 font-medium">50</span>
            <span className="text-xs text-gray-600 font-medium">0</span>
          </div>
          
          {/* Y-axis label */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90">
            <span className="text-sm font-medium text-gray-700">BPM</span>
          </div>
          
          {/* X-axis */}
          <div className="absolute bottom-4 left-16 right-4 flex justify-between">
            <span className="text-xs text-gray-600 font-medium">0</span>
            <span className="text-xs text-gray-600 font-medium">60</span>
            <span className="text-xs text-gray-600 font-medium">120</span>
            <span className="text-xs text-gray-600 font-medium">180</span>
            <span className="text-xs text-gray-600 font-medium">240</span>
          </div>
          
          {/* X-axis label */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <span className="text-sm font-medium text-gray-700">Minutes</span>
          </div>
          
          {/* Grid lines */}
          <div className="absolute left-16 right-4 top-4 bottom-16">
            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <div 
                key={`h-${i}`} 
                className="absolute w-full border-t border-gray-300" 
                style={{ top: `${i * 25}%` }}
              ></div>
            ))}
            {/* Vertical grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <div 
                key={`v-${i}`} 
                className="absolute h-full border-l border-gray-300" 
                style={{ left: `${i * 25}%` }}
              ></div>
            ))}
          </div>
          
          {/* Heart Rate Line Chart */}
          <div className="absolute left-16 right-4 top-4 bottom-16">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#0d9488"
                strokeWidth="0.5"
                points={heartRateData.map((point, index) => {
                  const x = (index / (heartRateData.length - 1)) * 100;
                  const y = 100 - ((point.heartRate - 0) / (200 - 0)) * 100;
                  return `${x},${y}`;
                }).join(' ')}
              />
              {/* Data points */}
              {heartRateData.map((point, index) => {
                const x = (index / (heartRateData.length - 1)) * 100;
                const y = 100 - ((point.heartRate - 0) / (200 - 0)) * 100;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="0.3"
                    fill="#0d9488"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={() => setActiveView('voss')}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <FileText className="w-5 h-5 mr-2" />
          VOSS Survey Results
        </Button>
        
        <Button 
          onClick={() => setActiveView('episodes')}
          variant="outline"
          size="lg"
          className="w-full"
        >
          <Clock className="w-5 h-5 mr-2" />
          Episode History
        </Button>
      </div>
    </div>
  );

  const renderVossResults = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">VOSS Survey Results</h3>
        <Button variant="ghost" onClick={() => setActiveView('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-teal-600">
              {patient.vossComparison.baselineScore}
            </div>
            <div className="text-gray-600">VOSS Baseline Score</div>
            <div className="text-sm text-gray-500">
              (out of 90 maximum)
            </div>
          </div>

          {/* Score Visualization */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Symptom Burden Level:</h4>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-teal-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(patient.vossComparison.baselineScore / 90) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 - None</span>
              <span>45 - Moderate</span>
              <span>90 - Severe</span>
            </div>
          </div>

          {/* Severity Classification */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <h4 className="font-medium text-teal-900 mb-2">Classification:</h4>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              patient.vossComparison.baselineScore >= 45 ? 'bg-red-100 text-red-800' :
              patient.vossComparison.baselineScore >= 25 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {patient.vossComparison.baselineScore >= 45 ? 'High Symptom Burden' :
               patient.vossComparison.baselineScore >= 25 ? 'Moderate Symptom Burden' :
               'Mild Symptom Burden'}
            </div>
          </div>
        </div>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Clinical Interpretation:</h4>
        <p className="text-sm text-blue-800">{patient.vossComparison.interpretation}</p>
      </div>

      {/* VOSS Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">About VOSS:</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Vanderbilt Orthostatic Symptom Score measures symptom burden in POTS</li>
          <li>• Scores range from 0-90 (9 symptoms × 0-10 scale each)</li>
          <li>• Higher scores indicate greater subjective symptom severity</li>
          <li>• Provides baseline assessment of orthostatic symptoms</li>
        </ul>
      </div>
    </div>
  );

  const renderEpisodeHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Episode History</h3>
        <Button variant="ghost" onClick={() => setActiveView('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-4">
        {patient.episodes.map((episode) => (
          <Card key={episode.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {new Date(episode.date).toLocaleDateString()}
                  </span>
                  <span className="text-gray-600">at {episode.time}</span>
                </div>
                <div className="text-sm text-gray-500">Duration: {episode.duration}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Severity:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  episode.severity >= 7 ? 'bg-red-100 text-red-800' :
                  episode.severity >= 4 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {episode.severity}/10
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Symptoms:</h4>
                <div className="flex flex-wrap gap-2">
                  {episode.symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              {episode.heartRate && (
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-700">Heart Rate: {episode.heartRate} BPM</span>
                </div>
              )}

              {/* Episode Details */}
              <div className="space-y-2">
                {episode.timeOfDay && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Time of Day:</span>
                    <span className="text-sm text-gray-800">{episode.timeOfDay}</span>
                  </div>
                )}
                
                {episode.activityType && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Activity:</span>
                    <span className="text-sm text-gray-800">{episode.activityType}</span>
                  </div>
                )}
                
                {episode.otherDetails && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Additional Details:</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                      {episode.otherDetails}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600">Patient Code: {patient.patientCode}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Study Complete
            </div>
          </div>
        </div>

        {/* Content */}
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'voss' && renderVossResults()}
        {activeView === 'episodes' && renderEpisodeHistory()}
      </div>
    </div>
  );
}