import React from 'react';
import { DailyTest } from '../../types';

interface DailyTestHeartRateGraphProps {
  dailyTest: DailyTest;
  dayNumber: number;
}

export function DailyTestHeartRateGraph({ dailyTest, dayNumber }: DailyTestHeartRateGraphProps) {
  const width = 600;
  const height = 300;
  const margin = { top: 40, right: 80, bottom: 60, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Time range: 0-7 minutes (420 seconds)
  const timeRange = { min: 0, max: 420 };
  // HR range: 40-200 BPM
  const hrRange = { min: 40, max: 200 };

  // Convert time (seconds) to x coordinate
  const timeToX = (timeInSeconds: number) => {
    return (timeInSeconds / timeRange.max) * chartWidth;
  };

  // Convert heart rate to y coordinate
  const hrToY = (heartRate: number) => {
    return chartHeight - ((heartRate - hrRange.min) / (hrRange.max - hrRange.min)) * chartHeight;
  };

  // Convert timestamp to seconds from start
  const timestampToSeconds = (timestamp: string, baseTimestamp: string) => {
    return (new Date(timestamp).getTime() - new Date(baseTimestamp).getTime()) / 1000;
  };

  // Get base timestamp (first reading)
  const baseTimestamp = dailyTest.heartRateReadings[0]?.timestamp || new Date().toISOString();

  // Create path for heart rate line
  const heartRatePath = dailyTest.heartRateReadings
    .map((reading, index) => {
      const seconds = timestampToSeconds(reading.timestamp, baseTimestamp);
      const x = timeToX(seconds);
      const y = hrToY(reading.heartRate);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Find BP readings and their positions
  const bpMarkers = dailyTest.bpReadings.map(bp => {
    const seconds = timestampToSeconds(bp.timestamp, baseTimestamp);
    const x = timeToX(seconds);
    
    // Find closest heart rate reading for y position
    const closestHRReading = dailyTest.heartRateReadings.reduce((closest, reading) => {
      const readingSeconds = timestampToSeconds(reading.timestamp, baseTimestamp);
      const currentDiff = Math.abs(readingSeconds - seconds);
      const closestDiff = Math.abs(timestampToSeconds(closest.timestamp, baseTimestamp) - seconds);
      return currentDiff < closestDiff ? reading : closest;
    });
    
    const y = hrToY(closestHRReading.heartRate);
    
    return {
      x,
      y,
      seconds,
      bp,
      heartRate: closestHRReading.heartRate
    };
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Day {dayNumber} - Heart Rate & Blood Pressure
      </h4>
      <div className="text-sm text-gray-600 mb-2">
        {new Date(dailyTest.date).toLocaleDateString()}
      </div>
      
      <svg width={width} height={height} className="border border-gray-100">
        {/* Background */}
        <rect width={width} height={height} fill="#fafafa" />
        
        {/* Chart area */}
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines - horizontal */}
          {[60, 80, 100, 120, 140, 160, 180].map(hr => (
            <g key={hr}>
              <line
                x1={0}
                y1={hrToY(hr)}
                x2={chartWidth}
                y2={hrToY(hr)}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
              <text
                x={-10}
                y={hrToY(hr)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {hr}
              </text>
            </g>
          ))}
          
          {/* Grid lines - vertical */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(minute => (
            <g key={minute}>
              <line
                x1={timeToX(minute * 60)}
                y1={0}
                x2={timeToX(minute * 60)}
                y2={chartHeight}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
              <text
                x={timeToX(minute * 60)}
                y={chartHeight + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {minute}
              </text>
            </g>
          ))}
          
          {/* Phase backgrounds */}
          {/* Lying/sitting phase (0-2 minutes) */}
          <rect
            x={0}
            y={0}
            width={timeToX(120)}
            height={chartHeight}
            fill="#ddd6fe"
            fillOpacity={0.2}
          />
          
          {/* Standing phase (2-7 minutes) */}
          <rect
            x={timeToX(120)}
            y={0}
            width={timeToX(300)}
            height={chartHeight}
            fill="#fed7d7"
            fillOpacity={0.2}
          />
          
          {/* Phase labels */}
          <text
            x={timeToX(60)}
            y={-10}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="#7c3aed"
          >
            Lying/Sitting
          </text>
          <text
            x={timeToX(270)}
            y={-10}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="#dc2626"
          >
            Standing
          </text>
          
          {/* Heart rate line */}
          <path
            d={heartRatePath}
            fill="none"
            stroke="#0d9488"
            strokeWidth={2}
          />
          
          {/* BP markers */}
          {bpMarkers.map((marker, index) => (
            <g key={index}>
              {/* BP marker circle */}
              <circle
                cx={marker.x}
                cy={marker.y}
                r={6}
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth={2}
              />
              
              {/* BP reading label */}
              <g transform={`translate(${marker.x}, ${marker.y - 25})`}>
                <rect
                  x={-25}
                  y={-12}
                  width={50}
                  height={20}
                  fill="#ffffff"
                  stroke="#dc2626"
                  strokeWidth={1}
                  rx={4}
                />
                <text
                  x={0}
                  y={0}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#dc2626"
                >
                  {marker.bp.systolic}/{marker.bp.diastolic}
                </text>
              </g>
              
              {/* Position label */}
              <text
                x={marker.x}
                y={chartHeight + 40}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
              >
                {marker.bp.position}
              </text>
            </g>
          ))}
        </g>
        
        {/* Axis labels */}
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#374151"
        >
          Time (minutes)
        </text>
        
        <text
          x={20}
          y={height / 2}
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="#374151"
          transform={`rotate(-90, 20, ${height / 2})`}
        >
          Heart Rate (BPM)
        </text>
        
        {/* Legend */}
        <g transform={`translate(${width - 150}, 30)`}>
          <rect x={0} y={0} width={140} height={80} fill="#ffffff" stroke="#e5e7eb" strokeWidth={1} rx={4} />
          
          {/* HR line legend */}
          <line x1={10} y1={20} x2={30} y2={20} stroke="#0d9488" strokeWidth={2} />
          <text x={35} y={24} fontSize="12" fill="#374151">Heart Rate</text>
          
          {/* BP marker legend */}
          <circle cx={20} cy={40} r={4} fill="#dc2626" stroke="#ffffff" strokeWidth={1} />
          <text x={35} y={44} fontSize="12" fill="#374151">Blood Pressure</text>
          
          {/* Phase legend */}
          <rect x={10} y={55} width={15} height={8} fill="#ddd6fe" fillOpacity={0.4} />
          <text x={30} y={62} fontSize="10" fill="#374151">Lying</text>
          <rect x={70} y={55} width={15} height={8} fill="#fed7d7" fillOpacity={0.4} />
          <text x={90} y={62} fontSize="10" fill="#374151">Standing</text>
        </g>
      </svg>
    </div>
  );
}