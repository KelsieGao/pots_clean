// Core application types
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sexAssignedAtBirth: 'female' | 'male' | 'prefer-not-to-say';
  reasonForUse: 'doctor-referral' | 'suspect-pots' | 'other';
  reasonForUseOther?: string;
  patientCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  category: 'beta-blocker' | 'midodrine' | 'fludrocortisone' | 'ssri-snri' | 'other';
  customName?: string;
}

export interface SupportPartner {
  id: string;
  name: string;
  email: string;
  relationship: string;
  permissions: string[];
  inviteStatus: 'pending' | 'accepted' | 'declined';
}

export interface VossQuestion {
  id: string;
  question: string;
  category: string;
  options: VossOption[];
}

export interface VossOption {
  value: number;
  label: string;
}

export interface VossResponse {
  questionId: string;
  value: number;
  textValue?: string;
  timestamp: string;
}

export interface Episode {
  id: string;
  startTime: string;
  endTime?: string;
  symptoms: string[];
  notes?: string;
  audioNote?: string;
  severity?: number;
  heartRateData?: HeartRateReading[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface HeartRateReading {
  timestamp: string;
  heartRate: number;
  position: 'lying' | 'sitting' | 'standing';
}

export interface BPReading {
  timestamp: string;
  systolic: number;
  diastolic: number;
  position: 'lying' | 'standing';
}

export interface DailyTest {
  id: string;
  patientId: string;
  date: string;
  completed: boolean;
  heartRateReadings: HeartRateReading[];
  bpReadings: BPReading[];
  notes?: string;
}

export interface AppState {
  currentScreen: string;
  patient?: Patient;
  isClinicianMode?: boolean;
  clinicianCode?: string;
  selectedPatientId?: string;
  onboardingComplete: boolean;
  deviceConnected: boolean;
  currentEpisode?: Episode;
  dailyTests: DailyTest[];
  patientDailyTests: Record<string, DailyTest[]>;
  currentDay: number;
  totalBaselineDays: number;
  currentTestStep: 'intro' | 'sit-lie' | 'stand' | 'complete';
  vossBaseline?: VossResponse[];
  vossFollowUp?: VossResponse[];
  medications: Medication[];
  supportPartner?: SupportPartner;
  locationEnabled: boolean;
  episodes: Episode[];
  symptoms: SymptomEntry[];
  reportGenerated: boolean;
  reportData?: MedicalReport;
  isBPPromptVisible: boolean;
  currentBPPosition?: 'lying' | 'standing';
  bpSystolic: string;
  bpDiastolic: string;
  tempBPReadings: BPReading[];
}

export interface MedicalReport {
  id: string;
  patientId: string;
  generatedAt: string;
  reportPeriod: {
    startDate: string;
    endDate: string;
  };
  baselineResults: BaselineAnalysis;
  symptomAnalysis: SymptomAnalysis;
  vossComparison: VossComparison;
  recommendations: string[];
  rawData: {
    dailyTests: DailyTest[];
    episodes: Episode[];
    symptoms: SymptomEntry[];
  };
}

export interface BaselineAnalysis {
  averageRestingHR: number;
  averageStandingHR: number;
  averageHRIncrease: number;
  maxHRIncrease: number;
  potsIndicators: {
    meetsHRCriteria: boolean;
    sustainedIncrease: boolean;
    symptomCorrelation: boolean;
  };
  dailyTrends: {
    day: number;
    restingHR: number;
    standingHR: number;
    hrIncrease: number;
  }[];
}

export interface SymptomAnalysis {
  totalEpisodes: number;
  averageEpisodeDuration: number;
  mostCommonSymptoms: { symptom: string; frequency: number }[];
  averageSeverity: number;
  symptomTrends: {
    date: string;
    episodeCount: number;
    averageSeverity: number;
  }[];
  triggerPatterns: string[];
}

export interface VossComparison {
  baselineScore: number;
  followUpScore: number;
  scoreDifference: number;
  interpretation: string;
}

export interface SymptomEntry {
  id: string;
  timestamp: string;
  symptoms: string[];
  severity: number; // 1-10 scale
  notes?: string;
  timeOfDay?: string;
  activityType?: string;
  otherDetails?: string;
  audioNote?: string;
  heartRate?: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  episodeId?: string; // Links to an episode if part of one
}