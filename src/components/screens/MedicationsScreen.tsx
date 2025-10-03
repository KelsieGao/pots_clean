import React, { useState } from 'react';
import { ArrowLeft, Pill, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Medication } from '../../types';

interface MedicationsScreenProps {
  onComplete: (medications: Medication[]) => void;
  onBack: () => void;
}

const medicationCategories = [
  { id: 'beta-blocker', name: 'Beta Blocker', description: 'e.g., Propranolol, Metoprolol' },
  { id: 'midodrine', name: 'Midodrine', description: 'Alpha-1 agonist' },
  { id: 'fludrocortisone', name: 'Fludrocortisone', description: 'Mineralocorticoid' },
  { id: 'ssri-snri', name: 'SSRI/SNRI', description: 'Antidepressants' },
  { id: 'other', name: 'Other', description: 'Custom medication' }
];

export function MedicationsScreen({ onComplete, onBack }: MedicationsScreenProps) {
  const [selectedMedications, setSelectedMedications] = useState<Medication[]>([]);
  const [customMedication, setCustomMedication] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleMedicationToggle = (categoryId: string, categoryName: string) => {
    const existingIndex = selectedMedications.findIndex(med => med.category === categoryId);
    
    if (existingIndex >= 0) {
      // Remove medication
      setSelectedMedications(prev => prev.filter((_, index) => index !== existingIndex));
    } else {
      // Add medication
      const newMedication: Medication = {
        id: crypto.randomUUID(),
        name: categoryName,
        category: categoryId as Medication['category']
      };
      setSelectedMedications(prev => [...prev, newMedication]);
    }
  };

  const handleCustomMedicationAdd = () => {
    if (customMedication.trim()) {
      const newMedication: Medication = {
        id: crypto.randomUUID(),
        name: 'Other',
        category: 'other',
        customName: customMedication.trim()
      };
      setSelectedMedications(prev => [...prev, newMedication]);
      setCustomMedication('');
      setShowCustomInput(false);
    }
  };

  const handleComplete = () => {
    onComplete(selectedMedications);
  };

  const handleSkip = () => {
    onComplete([]);
  };

  const isSelected = (categoryId: string) => {
    return selectedMedications.some(med => med.category === categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Current Medications</h1>
        </div>

        <Card className="space-y-6">
          <div className="text-center space-y-2">
            <Pill className="w-10 h-10 text-teal-600 mx-auto" />
            <h2 className="text-lg font-semibold text-gray-900">Medications (Optional)</h2>
            <p className="text-gray-600 text-sm">
              Select any medications you're currently taking that might affect your heart rate or blood pressure.
            </p>
          </div>

          <div className="space-y-3">
            {medicationCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleMedicationToggle(category.id, category.name)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                  isSelected(category.id)
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected(category.id)
                      ? 'border-teal-500 bg-teal-500'
                      : 'border-gray-300'
                  }`}>
                    {isSelected(category.id) && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {/* Custom Medication Input */}
            {showCustomInput ? (
              <div className="space-y-3 p-4 border-2 border-teal-200 rounded-lg bg-teal-50">
                <Input
                  label="Medication Name"
                  value={customMedication}
                  onChange={(e) => setCustomMedication(e.target.value)}
                  placeholder="Enter medication name"
                />
                <div className="flex space-x-2">
                  <Button onClick={handleCustomMedicationAdd} size="sm">
                    Add
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomMedication('');
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
                Add Custom Medication
              </Button>
            )}
          </div>

          {/* Selected Medications Summary */}
          {selectedMedications.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-2">Selected Medications:</p>
              <ul className="space-y-1">
                {selectedMedications.map((med) => (
                  <li key={med.id} className="text-sm text-gray-700">
                    • {med.customName || med.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <Button onClick={handleComplete} size="lg" className="w-full">
              Continue
            </Button>
            <Button onClick={handleSkip} variant="outline" size="lg" className="w-full">
              Skip - No Medications
            </Button>
          </div>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>This information helps interpret your heart rate data</p>
        </div>
      </div>
    </div>
  );
}