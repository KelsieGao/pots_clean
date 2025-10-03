import React, { useState } from 'react';
import { ArrowLeft, Users, Mail, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';

interface SupportPartnerScreenProps {
  onComplete: (supportPartner?: { name: string; email: string; relationship: string }) => void;
  onBack: () => void;
}

export function SupportPartnerScreen({ onComplete, onBack }: SupportPartnerScreenProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    relationship: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const relationshipOptions = [
    { value: '', label: 'Select relationship...' },
    { value: 'parent', label: 'Parent' },
    { value: 'guardian', label: 'Guardian' },
    { value: 'spouse', label: 'Spouse/Partner' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
    { value: 'caregiver', label: 'Caregiver' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.relationship) {
      newErrors.relationship = 'Please select a relationship';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Support Partner</h1>
        </div>

        <Card className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Add a Support Partner</h2>
            <p className="text-gray-600 text-sm">
              Invite a parent, caregiver, or trusted person to help you log symptoms and provide support.
            </p>
          </div>

          {!showForm ? (
            <div className="space-y-6">
              {/* What they can do */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h3 className="font-medium text-teal-900 mb-2">What your support partner can do:</h3>
                <ul className="space-y-1 text-sm text-teal-800">
                  <li>• Help log symptoms when you're not feeling well</li>
                  <li>• View your symptom patterns and trends</li>
                  <li>• Receive notifications about your episodes</li>
                  <li>• Support you during difficult moments</li>
                </ul>
              </div>

              {/* What they cannot do */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">What they cannot do:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Access your personal information without permission</li>
                  <li>• Change your account settings</li>
                  <li>• View your data without your consent</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button onClick={() => setShowForm(true)} size="lg" className="w-full">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Support Partner
                </Button>
                <Button onClick={handleSkip} variant="outline" size="lg" className="w-full">
                  Skip for Now
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                You can add or remove support partners anytime in Settings
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="w-5 h-5 text-teal-600" />
                <h3 className="font-medium text-gray-900">Invite Support Partner</h3>
              </div>

              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter their full name"
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="Enter their email address"
              />

              <Select
                label="Relationship"
                value={formData.relationship}
                onChange={(e) => handleInputChange('relationship', e.target.value)}
                options={relationshipOptions}
                error={errors.relationship}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  They'll receive an email invitation to download the app and connect with you.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleSubmit} className="flex-1">
                  Send Invitation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}