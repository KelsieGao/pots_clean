import React, { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { Patient } from '../../types';

interface PatientInfoScreenProps {
  onSubmit: (patientInfo: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onBack: () => void;
  patientCode: string;
}

export function PatientInfoScreen({ onSubmit, onBack, patientCode }: PatientInfoScreenProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    sexAssignedAtBirth: '' as 'female' | 'male' | 'prefer-not-to-say' | '',
    reasonForUse: '' as 'doctor-referral' | 'suspect-pots' | 'other' | '',
    reasonForUseOther: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      // Basic date validation
      const date = new Date(formData.dateOfBirth);
      const today = new Date();
      if (date > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }

    if (!formData.sexAssignedAtBirth) {
      newErrors.sexAssignedAtBirth = 'Please select an option';
    }

    if (!formData.reasonForUse) {
      newErrors.reasonForUse = 'Please select a reason';
    }

    if (formData.reasonForUse === 'other' && !formData.reasonForUseOther.trim()) {
      newErrors.reasonForUseOther = 'Please specify your reason';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        patientCode,
        sexAssignedAtBirth: formData.sexAssignedAtBirth as 'female' | 'male' | 'prefer-not-to-say',
        reasonForUse: formData.reasonForUse as 'doctor-referral' | 'suspect-pots' | 'other'
      });
    }
  };

  const sexOptions = [
    { value: '', label: 'Select...' },
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const reasonOptions = [
    { value: '', label: 'Select...' },
    { value: 'doctor-referral', label: 'Doctor referral' },
    { value: 'suspect-pots', label: 'I suspect I have POTS' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Patient Information</h1>
        </div>

        <Card className="space-y-6">
          <div className="text-center space-y-2">
            <User className="w-10 h-10 text-teal-600 mx-auto" />
            <h2 className="text-lg font-semibold text-gray-900">Tell us about yourself</h2>
            <p className="text-gray-600 text-sm">
              This information helps us personalize your experience and provide better insights.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
                placeholder="John"
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
                placeholder="Doe"
              />
            </div>

            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
              helpText="MM/DD/YYYY"
            />

            <Select
              label="Sex Assigned at Birth"
              value={formData.sexAssignedAtBirth}
              onChange={(e) => handleInputChange('sexAssignedAtBirth', e.target.value)}
              options={sexOptions}
              error={errors.sexAssignedAtBirth}
            />

            <Select
              label="Why are you using this app?"
              value={formData.reasonForUse}
              onChange={(e) => handleInputChange('reasonForUse', e.target.value)}
              options={reasonOptions}
              error={errors.reasonForUse}
            />

            {formData.reasonForUse === 'other' && (
              <Input
                label="Please specify"
                value={formData.reasonForUseOther}
                onChange={(e) => handleInputChange('reasonForUseOther', e.target.value)}
                error={errors.reasonForUseOther}
                placeholder="Tell us more about your reason..."
              />
            )}
          </div>

          <Button 
            onClick={handleSubmit}
            size="lg"
            className="w-full"
          >
            Continue
          </Button>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>Your information is encrypted and secure.</p>
        </div>
      </div>
    </div>
  );
}