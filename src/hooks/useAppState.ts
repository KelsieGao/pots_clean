import { useState, useCallback } from 'react';
import { AppState, Patient, Medication, SupportPartner, VossResponse, BPReading, DailyTest, HeartRateReading } from '../types';

// Helper function to generate mock daily test data
function generateMockDailyTestData(patientId: string, day: number): DailyTest {
  const testDate = new Date(Date.now() - (5 - day) * 24 * 60 * 60 * 1000);
  const baseTime = testDate.getTime();
  
  // Generate heart rate readings for 7 minutes (420 seconds)
  const heartRateReadings: HeartRateReading[] = [];
  
  // Phase 1: Lying/sitting for 2 minutes (0-120 seconds)
  const baseRestingHR = 70 + Math.random() * 10;
  for (let i = 0; i <= 120; i += 5) {
    heartRateReadings.push({
      timestamp: new Date(baseTime + i * 1000).toISOString(),
      heartRate: Math.round(baseRestingHR + (Math.random() - 0.5) * 4),
      position: 'lying'
    });
  }
  
  // Phase 2: Standing transition and standing for 5 minutes (120-420 seconds)
  const hrIncrease = 25 + Math.random() * 20; // 25-45 bpm increase
  const standingHR = baseRestingHR + hrIncrease;
  
  for (let i = 125; i <= 420; i += 5) {
    // Gradual increase in first 30 seconds of standing
    let currentHR;
    if (i <= 150) {
      const transitionProgress = (i - 120) / 30;
      currentHR = baseRestingHR + (hrIncrease * transitionProgress);
    } else {
      currentHR = standingHR;
    }
    
    heartRateReadings.push({
      timestamp: new Date(baseTime + i * 1000).toISOString(),
      heartRate: Math.round(currentHR + (Math.random() - 0.5) * 6),
      position: 'standing'
    });
  }
  
  // Generate BP readings
  const bpReadings: BPReading[] = [
    {
      timestamp: new Date(baseTime + 60 * 1000).toISOString(), // 1 minute
      systolic: Math.round(110 + Math.random() * 10),
      diastolic: Math.round(70 + Math.random() * 8),
      position: 'lying'
    },
    {
      timestamp: new Date(baseTime + 240 * 1000).toISOString(), // 4 minutes
      systolic: Math.round(125 + Math.random() * 15),
      diastolic: Math.round(80 + Math.random() * 12),
      position: 'standing'
    }
  ];
  
  return {
    id: crypto.randomUUID(),
    patientId,
    date: testDate.toISOString().split('T')[0],
    completed: true,
    heartRateReadings,
    bpReadings,
    notes: `Day ${day} baseline test completed`
  };
}

// Helper function to generate all mock patient daily tests
function generateAllMockPatientDailyTests(): Record<string, DailyTest[]> {
  const patientIds = ['1', '2', '3', '4']; // Sarah Johnson, Michael Chen, Emily Rodriguez, David Thompson
  const patientDailyTests: Record<string, DailyTest[]> = {};
  
  patientIds.forEach(patientId => {
    patientDailyTests[patientId] = [];
    for (let day = 1; day <= 5; day++) {
      patientDailyTests[patientId].push(generateMockDailyTestData(patientId, day));
    }
  });
  
  return patientDailyTests;
}

const initialState: AppState = {
  currentScreen: 'launch',
  isClinicianMode: false,
  selectedPatientId: undefined,
  onboardingComplete: false,
  deviceConnected: false,
  dailyTests: [],
  patientDailyTests: generateAllMockPatientDailyTests(),
  currentDay: 1,
  totalBaselineDays: 5,
  currentTestStep: 'intro',
  medications: [],
  vossFollowUp: undefined,
  locationEnabled: false,
  episodes: [],
  symptoms: [],
  reportGenerated: false,
  isBPPromptVisible: false,
  currentBPPosition: undefined,
  bpSystolic: '',
  bpDiastolic: '',
  tempBPReadings: [],
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loginUser = useCallback(() => {
    const mockPatientId = '3'; // Emily Rodriguez
    
    updateState({ 
      onboardingComplete: true, 
      currentScreen: 'home',
      // Simulate returning user with some existing data
      currentDay: 3, // Example: user is on day 3
      dailyTests: [
        {
          id: '1',
          patientId: mockPatientId,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: true,
          heartRateReadings: [],
          bpReadings: [],
          notes: 'Day 1 baseline test completed'
        },
        {
          id: '2', 
          patientId: mockPatientId,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          completed: true,
          heartRateReadings: [],
          bpReadings: [],
          notes: 'Day 2 baseline test completed'
        }
      ]
    });
  }, [updateState]);

  const setCurrentScreen = useCallback((screen: string) => {
    updateState({ currentScreen: screen });
  }, [updateState]);

  const loginClinician = useCallback((code: string) => {
    updateState({ 
      isClinicianMode: true,
      clinicianCode: code,
      currentScreen: 'clinician-home'
    });
  }, [updateState]);

  const addPatientToClinician = useCallback((patientCode: string) => {
    // TODO: Add patient to clinician's patient list
    console.log('Adding patient with code:', patientCode);
    updateState({ currentScreen: 'clinician-home' });
  }, [updateState]);

  const setPatient = useCallback((patient: Patient) => {
    updateState({ patient });
  }, [updateState]);

  const setMedications = useCallback((medications: Medication[]) => {
    updateState({ medications });
  }, [updateState]);

  const setSupportPartner = useCallback((supportPartner: SupportPartner) => {
    updateState({ supportPartner });
  }, [updateState]);

  const setVossBaseline = useCallback((responses: VossResponse[]) => {
    updateState({ vossBaseline: responses });
  }, [updateState]);

  const setVossFollowUp = useCallback((responses: VossResponse[]) => {
    updateState({ vossFollowUp: responses });
  }, [updateState]);

  const setLocationEnabled = useCallback((enabled: boolean) => {
    updateState({ locationEnabled: enabled });
  }, [updateState]);

  const setDeviceConnected = useCallback((connected: boolean) => {
    updateState({ deviceConnected: connected });
  }, [updateState]);

  const completeOnboarding = useCallback(() => {
    updateState({ onboardingComplete: true, currentScreen: 'home' });
  }, [updateState]);

  const startDailyTest = useCallback(() => {
    updateState({ currentScreen: 'intro-to-test', currentTestStep: 'intro' });
  }, [updateState]);

  const nextTestStep = useCallback(() => {
    setState(prev => {
      const nextStep = prev.currentTestStep === 'intro' ? 'sit-lie' : 
                      prev.currentTestStep === 'sit-lie' ? 'stand' : 'complete';
      
      const nextScreen = nextStep === 'sit-lie' ? 'sit-lie-down' :
                        nextStep === 'stand' ? 'time-to-stand' :
                        'daily-test-complete';
      
      return {
        ...prev,
        currentTestStep: nextStep,
        currentScreen: nextScreen
      };
    });
  }, []);

  const completeDailyTest = useCallback(() => {
    setState(prev => {
      const currentPatientId = prev.patient?.id || 'default';
      const newDailyTest = generateMockDailyTestData(currentPatientId, prev.currentDay);
      
      // Override with actual BP readings if available
      if (prev.tempBPReadings.length > 0) {
        newDailyTest.bpReadings = [...prev.tempBPReadings];
      }

      const updatedDailyTests = [...prev.dailyTests, newDailyTest];
      const updatedPatientDailyTests = {
        ...prev.patientDailyTests,
        [currentPatientId]: [
          ...(prev.patientDailyTests[currentPatientId] || []),
          newDailyTest
        ]
      };
      const nextDay = prev.currentDay + 1;
      
      if (nextDay > prev.totalBaselineDays) {
        // All 5 days complete
        return {
          ...prev,
          dailyTests: updatedDailyTests,
          patientDailyTests: updatedPatientDailyTests,
          currentScreen: 'five-day-complete',
          currentTestStep: 'intro'
        };
      } else {
        // More days remaining
        return {
          ...prev,
          dailyTests: updatedDailyTests,
          patientDailyTests: updatedPatientDailyTests,
          currentDay: nextDay,
          currentScreen: 'home',
          currentTestStep: 'intro',
          tempBPReadings: []
        };
      }
    });
  }, []);

  const goToHomeScreen = useCallback(() => {
    updateState({ currentScreen: 'home' });
  }, [updateState]);

  const cancelDailyTest = useCallback(() => {
    updateState({ 
      currentScreen: 'home',
      currentTestStep: 'intro',
      tempBPReadings: [],
      isBPPromptVisible: false,
      currentBPPosition: undefined,
      bpSystolic: '',
      bpDiastolic: ''
    });
  }, [updateState]);

  const showBPPrompt = useCallback((position: 'lying' | 'standing') => {
    updateState({
      isBPPromptVisible: true,
      currentBPPosition: position,
      bpSystolic: '',
      bpDiastolic: ''
    });
  }, [updateState]);

  const recordBPReading = useCallback((systolic: number, diastolic: number, position: 'lying' | 'standing') => {
    const newBPReading: BPReading = {
      timestamp: new Date().toISOString(),
      systolic,
      diastolic,
      position
    };

    setState(prev => ({
      ...prev,
      tempBPReadings: [...prev.tempBPReadings, newBPReading],
      isBPPromptVisible: false,
      currentBPPosition: undefined,
      bpSystolic: '',
      bpDiastolic: ''
    }));
  }, []);

  const logSymptom = useCallback((symptomData: any) => {
    const newSymptom = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      symptoms: symptomData.symptoms,
      severity: symptomData.severity,
      notes: symptomData.notes,
      heartRate: symptomData.heartRate,
      location: symptomData.location
    };

    setState(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, newSymptom],
      currentScreen: 'home'
    }));
  }, []);

  const startEpisode = useCallback((symptomData: any) => {
    const newEpisode = {
      id: crypto.randomUUID(),
      startTime: new Date().toISOString(),
      symptoms: symptomData.symptoms,
      severity: symptomData.severity,
      notes: symptomData.notes,
      heartRateData: [],
      location: symptomData.location
    };

    updateState({ 
      currentEpisode: newEpisode,
      currentScreen: 'active-episode'
    });
  }, [updateState]);

  const updateEpisode = useCallback((updates: any) => {
    setState(prev => ({
      ...prev,
      currentEpisode: prev.currentEpisode ? {
        ...prev.currentEpisode,
        ...updates
      } : undefined
    }));
  }, []);

  const endEpisode = useCallback((finalNotes?: string) => {
    setState(prev => {
      if (!prev.currentEpisode) return prev;

      const completedEpisode = {
        ...prev.currentEpisode,
        endTime: new Date().toISOString(),
        notes: finalNotes || prev.currentEpisode.notes
      };

      return {
        ...prev,
        episodes: [...prev.episodes, completedEpisode],
        currentEpisode: undefined,
        currentScreen: 'episode-complete'
      };
    });
  }, []);

  const goToSymptomLog = useCallback(() => {
    updateState({ currentScreen: 'symptom-log' });
  }, [updateState]);

  const generateReport = useCallback(() => {
    updateState({ currentScreen: 'report-generation' });
  }, [updateState]);

  const setReportReady = useCallback(() => {
    updateState({ 
      currentScreen: 'report-ready',
      reportGenerated: true 
    });
  }, [updateState]);

  const viewReport = useCallback(() => {
    updateState({ currentScreen: 'report-view' });
  }, [updateState]);

  const downloadReport = useCallback(() => {
    // TODO: Implement PDF download
    console.log('Download report functionality not implemented yet');
  }, []);

  const emailReport = useCallback(() => {
    // TODO: Implement email functionality
    console.log('Email report functionality not implemented yet');
  }, []);

  const shareReport = useCallback(() => {
    // TODO: Implement provider sharing
    console.log('Share report functionality not implemented yet');
  }, []);

  return {
    state,
    updateState,
    setCurrentScreen,
    loginClinician,
    addPatientToClinician,
    loginUser,
    setPatient,
    setMedications,
    setSupportPartner,
    setVossBaseline,
    setVossFollowUp,
    setLocationEnabled,
    setDeviceConnected,
    completeOnboarding,
    startDailyTest,
    nextTestStep,
    completeDailyTest,
    goToHomeScreen,
    cancelDailyTest,
    logSymptom,
    startEpisode,
    updateEpisode,
    endEpisode,
    goToSymptomLog,
    generateReport,
    setReportReady,
    viewReport,
    downloadReport,
    emailReport,
    shareReport,
    showBPPrompt,
    recordBPReading,
  };
}