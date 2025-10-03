import React, { useState } from 'react';
import { ArrowLeft, Download, Mail, Share, TrendingUp, Heart, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MedicalReport } from '../../types';

interface ReportViewScreenProps {
  report: MedicalReport;
  onBack: () => void;
  onDownload: () => void;
  onEmail: () => void;
  onShare: () => void;
}

export function ReportViewScreen({ report, onBack, onDownload, onEmail, onShare }: ReportViewScreenProps) {
  const [activeSection, setActiveSection] = useState('summary');

  const sections = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'baseline', label: 'Heart Rate', icon: Heart },
    { id: 'symptoms', label: 'Symptoms', icon: TrendingUp },
    { id: 'voss', label: 'VOSS', icon: FileText }
  ];

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">POTS Assessment Report</h2>
        <p className="text-gray-600">
          {new Date(report.reportPeriod.startDate).toLocaleDateString()} - {new Date(report.reportPeriod.endDate).toLocaleDateString()}
        </p>
      </div>

      {/* Key Findings */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <h3 className="font-medium text-teal-900 mb-3">Key Findings:</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-700">
              +{report.baselineResults.averageHRIncrease}
            </div>
            <div className="text-sm text-teal-600">Avg HR Increase</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-700">
              {report.symptomAnalysis.totalEpisodes}
            </div>
            <div className="text-sm text-teal-600">Episodes Logged</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-700">
              {report.baselineResults.averageRestingHR}
            </div>
            <div className="text-sm text-teal-600">Avg Resting HR</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-700">
              {report.vossComparison.followUpScore}
            </div>
            <div className="text-sm text-teal-600">VOSS Score</div>
          </div>
        </div>
      </div>

      {/* POTS Indicators */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Clinical Indicators:</h3>
        <div className="space-y-2">
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            report.baselineResults.potsIndicators.meetsHRCriteria 
              ? 'bg-amber-50 border border-amber-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <span className="text-sm font-medium">Heart Rate Criteria (≥30 bpm increase)</span>
            <span className={`text-sm font-semibold ${
              report.baselineResults.potsIndicators.meetsHRCriteria ? 'text-amber-700' : 'text-green-700'
            }`}>
              {report.baselineResults.potsIndicators.meetsHRCriteria ? 'Met' : 'Not Met'}
            </span>
          </div>
          
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            report.baselineResults.potsIndicators.sustainedIncrease 
              ? 'bg-amber-50 border border-amber-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <span className="text-sm font-medium">Sustained HR Increase</span>
            <span className={`text-sm font-semibold ${
              report.baselineResults.potsIndicators.sustainedIncrease ? 'text-amber-700' : 'text-green-700'
            }`}>
              {report.baselineResults.potsIndicators.sustainedIncrease ? 'Present' : 'Absent'}
            </span>
          </div>
          
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            report.baselineResults.potsIndicators.symptomCorrelation 
              ? 'bg-amber-50 border border-amber-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <span className="text-sm font-medium">Symptom Correlation</span>
            <span className={`text-sm font-semibold ${
              report.baselineResults.potsIndicators.symptomCorrelation ? 'text-amber-700' : 'text-green-700'
            }`}>
              {report.baselineResults.potsIndicators.symptomCorrelation ? 'Present' : 'Absent'}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Recommendations:</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          {report.recommendations.map((rec, index) => (
            <li key={index}>• {rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderBaseline = () => (
    <div className="space-y-6">
      <h3 className="font-medium text-gray-900">5-Day Heart Rate Analysis</h3>
      
      {/* Daily Trends */}
      <div className="space-y-4">
        {report.baselineResults.dailyTrends.map((day) => (
          <div key={day.day} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">Day {day.day}</span>
              <span className="text-sm text-gray-600">+{day.hrIncrease} bpm increase</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Resting: </span>
                <span className="font-medium">{day.restingHR} bpm</span>
              </div>
              <div>
                <span className="text-gray-600">Standing: </span>
                <span className="font-medium">{day.standingHR} bpm</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <h4 className="font-medium text-teal-900 mb-3">Summary Statistics:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-teal-700">Average Resting HR:</span>
            <span className="font-medium text-teal-900">{report.baselineResults.averageRestingHR} bpm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-teal-700">Average Standing HR:</span>
            <span className="font-medium text-teal-900">{report.baselineResults.averageStandingHR} bpm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-teal-700">Average Increase:</span>
            <span className="font-medium text-teal-900">+{report.baselineResults.averageHRIncrease} bpm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-teal-700">Maximum Increase:</span>
            <span className="font-medium text-teal-900">+{report.baselineResults.maxHRIncrease} bpm</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSymptoms = () => (
    <div className="space-y-6">
      <h3 className="font-medium text-gray-900">Symptom Analysis</h3>
      
      {/* Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-700">{report.symptomAnalysis.totalEpisodes}</div>
          <div className="text-sm text-gray-600">Total Episodes</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-700">{report.symptomAnalysis.averageSeverity}/10</div>
          <div className="text-sm text-gray-600">Avg Severity</div>
        </div>
      </div>

      {/* Most Common Symptoms */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Most Common Symptoms:</h4>
        <div className="space-y-2">
          {report.symptomAnalysis.mostCommonSymptoms.map((symptom, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{symptom.symptom}</span>
              <span className="text-sm text-gray-600">{symptom.frequency} times</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trigger Patterns */}
      {report.symptomAnalysis.triggerPatterns.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Identified Patterns:</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            {report.symptomAnalysis.triggerPatterns.map((pattern, index) => (
              <li key={index}>• {pattern}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderVoss = () => (
    <div className="space-y-6">
      <h3 className="font-medium text-gray-900">VOSS Score Comparison</h3>
      
      {/* Baseline Score */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <h4 className="font-medium text-teal-900 mb-3">Baseline Assessment:</h4>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-teal-700">{report.vossComparison.baselineScore}</div>
            <div className="text-sm text-teal-600">VOSS Score</div>
          </div>
          <div>
            <div className="text-lg font-bold text-teal-700">90</div>
            <div className="text-sm text-teal-600">Maximum Score</div>
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Clinical Interpretation:</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">{report.vossComparison.interpretation}</p>
        </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Medical Report</h1>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onDownload} className="p-2">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={onEmail} className="p-2">
              <Mail className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={onShare} className="p-2">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* Report Content */}
        <Card className="min-h-[600px]">
          {activeSection === 'summary' && renderSummary()}
          {activeSection === 'baseline' && renderBaseline()}
          {activeSection === 'symptoms' && renderSymptoms()}
          {activeSection === 'voss' && renderVoss()}
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>This report should be reviewed with a qualified healthcare provider</p>
        </div>
      </div>
    </div>
  );
}