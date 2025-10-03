import React, { useState } from 'react';
import { Users, Plus, Search, Calendar, Activity } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface Patient {
  id: string;
  name: string;
  patientCode: string;
  lastActivity: string;
  status: 'active' | 'completed' | 'inactive';
  currentDay?: number;
  totalDays?: number;
}

interface ClinicianHomeScreenProps {
  onPatientSelect: (patientId: string) => void;
  onAddNewPatient: () => void;
}

export function ClinicianHomeScreen({ onPatientSelect, onAddNewPatient }: ClinicianHomeScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample patient data
  const patients: Patient[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      patientCode: 'SJ2024001',
      lastActivity: '2 hours ago',
      status: 'active',
      currentDay: 3,
      totalDays: 5
    },
    {
      id: '2',
      name: 'Michael Chen',
      patientCode: 'MC2024002',
      lastActivity: '1 day ago',
      status: 'active',
      currentDay: 5,
      totalDays: 5
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      patientCode: 'ER2024003',
      lastActivity: '3 days ago',
      status: 'completed',
      currentDay: 5,
      totalDays: 5
    },
    {
      id: '4',
      name: 'David Thompson',
      patientCode: 'DT2024004',
      lastActivity: '1 week ago',
      status: 'inactive',
      currentDay: 1,
      totalDays: 5
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="w-4 h-4" />;
      case 'completed':
        return <Calendar className="w-4 h-4" />;
      case 'inactive':
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          </div>
          
          <Button onClick={onAddNewPatient} className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add New Patient - Enter Code</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search patients by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>

        {/* Patient List */}
        <div className="space-y-4">
          {filteredPatients.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Add your first patient to get started.'}
              </p>
              <Button onClick={onAddNewPatient}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Patient
              </Button>
            </Card>
          ) : (
            filteredPatients.map((patient) => (
              <Card 
                key={patient.id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  console.log('Patient card clicked:', patient.id, patient.name);
                  onPatientSelect(patient.id);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 font-semibold text-lg">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">Code: {patient.patientCode}</p>
                      <p className="text-xs text-gray-500">Last activity: {patient.lastActivity}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Progress */}
                    {patient.currentDay && patient.totalDays && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Day {patient.currentDay} of {patient.totalDays}
                        </p>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-teal-600 h-2 rounded-full"
                            style={{ width: `${(patient.currentDay / patient.totalDays) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 ${getStatusColor(patient.status)}`}>
                      {getStatusIcon(patient.status)}
                      <span className="capitalize">{patient.status}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {patients.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Patients</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {patients.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed Studies</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {patients.length}
            </div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </Card>
        </div>
      </div>
    </div>
  );
}