import React from 'react';
import { useAppState } from './hooks/useAppState';
import { LaunchScreen } from './components/screens/LaunchScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { ClinicianCodeScreen } from './components/screens/ClinicianCodeScreen';
import { ClinicianHomeScreen } from './components/screens/ClinicianHomeScreen';
import { ClinicianAddPatientScreen } from './components/screens/ClinicianAddPatientScreen';
import { PatientDashboardScreen } from './components/screens/PatientDashboardScreen';
import { PatientCodeScreen } from './components/screens/PatientCodeScreen';
import { PrivacyScreen } from './components/screens/PrivacyScreen';
import { PatientInfoScreen } from './components/screens/PatientInfoScreen';
import { CompassSurveyScreen } from './components/screens/CompassSurveyScreen';
import { MedicationsScreen } from './components/screens/MedicationsScreen';
import { LocationAccessScreen } from './components/screens/LocationAccessScreen';
import { SupportPartnerScreen } from './components/screens/SupportPartnerScreen';
import { SetupCompleteScreen } from './components/screens/SetupCompleteScreen';
import { DeviceConnectionScreen } from './components/screens/DeviceConnectionScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { IntroToTestScreen } from './components/screens/IntroToTestScreen';
import { SitLieDownScreen } from './components/screens/SitLieDownScreen';
import { TimeToStandScreen } from './components/screens/TimeToStandScreen';
import { DailyTestCompleteScreen } from './components/screens/DailyTestCompleteScreen';
import { FiveDayCompleteScreen } from './components/screens/FiveDayCompleteScreen';
import { SymptomLogScreen } from './components/screens/SymptomLogScreen';
import { ActiveEpisodeScreen } from './components/screens/ActiveEpisodeScreen';
import { EpisodeCompleteScreen } from './components/screens/EpisodeCompleteScreen';
import { ReportGenerationScreen } from './components/screens/ReportGenerationScreen';
import { ReportReadyScreen } from './components/screens/ReportReadyScreen';
import { ReportViewScreen } from './components/screens/ReportViewScreen';
import { generateMedicalReport } from './utils/reportGenerator';
import { Patient } from './types';

function App() {
  const { 
    state, 
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
    updateState
  } = useAppState();

  // Debug: Log current screen state
  console.log('Current screen:', state.currentScreen);

  const handleLogin = () => {
    setCurrentScreen('login');
  };

  const handleNewUser = () => {
    setCurrentScreen('patient-code');
  };

  const handleClinicianLogin = () => {
    console.log('handleClinicianLogin called');
    updateState({ currentScreen: 'clinician-code' });
    console.log('State update called with clinician-code');
  };

  const handleLoginSubmit = (email: string, password: string) => {
    // TODO: Validate credentials with backend
    console.log('Login attempt:', email);
    loginUser();
  };

  const handleClinicianCodeSubmit = (code: string) => {
    // TODO: Validate clinician code with backend
    console.log('Clinician code:', code);
    loginClinician(code);
  };

  const handlePatientSelect = (patientId: string) => {
    // Load patient data and switch to patient dashboard
    console.log('Selected patient:', patientId);
    updateState({ 
      currentScreen: 'patient-dashboard',
      selectedPatientId: patientId 
    });
  };

  const handleAddNewPatient = () => {
    setCurrentScreen('clinician-add-patient');
  };

  const handlePatientCodeSubmit = (code: string) => {
    // TODO: Validate patient code and add to clinician's list
    console.log('Adding patient code:', code);
    addPatientToClinician(code);
  };

  const handleCodeSubmit = (code: string) => {
    // TODO: Validate code with backend
    console.log('Patient code:', code);
    setCurrentScreen('privacy');
  };

  const handlePrivacyAgree = () => {
    setCurrentScreen('patient-info');
  };

  const handlePatientInfoSubmit = (patientInfo: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const patient: Patient = {
      ...patientInfo,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setPatient(patient);
    setCurrentScreen('compass-survey');
  };

  const handleVossComplete = (responses: any[]) => {
    setVossBaseline(responses);
    setCurrentScreen('medications');
  };

  const handleMedicationsComplete = (medications: any[]) => {
    setMedications(medications);
    setCurrentScreen('location-access');
  };

  const handleLocationEnable = () => {
    setLocationEnabled(true);
    setCurrentScreen('support-partner');
  };

  const handleLocationSkip = () => {
    setLocationEnabled(false);
    setCurrentScreen('support-partner');
  };

  const handleSupportPartnerComplete = (supportPartner?: any) => {
    if (supportPartner) {
      setSupportPartner({
        id: crypto.randomUUID(),
        name: supportPartner.name,
        email: supportPartner.email,
        relationship: supportPartner.relationship,
        permissions: ['view-symptoms', 'log-symptoms'],
        inviteStatus: 'pending'
      });
    }
    setCurrentScreen('setup-complete');
  };

  const handleSetupComplete = () => {
    setCurrentScreen('device-connection');
  };

  const handleDeviceConnected = () => {
    setDeviceConnected(true);
    completeOnboarding();
  };

  const handleDeviceSkip = () => {
    setDeviceConnected(false);
    completeOnboarding();
  };

  const handleStartTest = () => {
    startDailyTest();
  };

  const handleSymptoms = () => {
    goToSymptomLog();
  };

  const handleNextTestStep = () => {
    nextTestStep();
  };

  const handleCompleteTest = () => {
    completeDailyTest();
  };

  const handleBackToHome = () => {
    goToHomeScreen();
  };

  const handleFiveDayComplete = () => {
    generateReport();
  };
  const handleReportReady = () => {
    // Generate the actual report data
    if (state.patient) {
      const reportData = generateMedicalReport(
        state.patient,
        state.dailyTests,
        state.episodes,
        state.symptoms,
        state.vossBaseline,
        state.vossFollowUp
      );
      
      // Store report data in state
      state.reportData = reportData;
    }
    
    setReportReady();
  };

  const handleViewReport = () => {
    viewReport();
  };

  const handleDownloadReport = () => {
    downloadReport();
  };

  const handleEmailReport = () => {
    emailReport();
  };

  const handleShareReport = () => {
    shareReport();
  };

  const handleBack = () => {
    switch (state.currentScreen) {
      case 'patient-code':
        setCurrentScreen('launch');
        break;
      case 'login':
        setCurrentScreen('launch');
        break;
      case 'clinician-code':
        setCurrentScreen('launch');
        break;
      case 'clinician-add-patient':
        setCurrentScreen('clinician-home');
        break;
      case 'privacy':
        setCurrentScreen('patient-code');
        break;
      case 'patient-info':
        setCurrentScreen('privacy');
        break;
      case 'compass-survey':
        setCurrentScreen('patient-info');
        break;
      case 'medications':
        setCurrentScreen('compass-survey');
        break;
      case 'location-access':
        setCurrentScreen('medications');
        break;
      case 'support-partner':
        setCurrentScreen('location-access');
        break;
      case 'setup-complete':
        setCurrentScreen('support-partner');
        break;
      case 'device-connection':
        setCurrentScreen('setup-complete');
        break;
      case 'intro-to-test':
        setCurrentScreen('home');
        break;
      case 'sit-lie-down':
        setCurrentScreen('intro-to-test');
      case 'symptom-log':
        setCurrentScreen('home');
        break;
      case 'active-episode':
        setCurrentScreen('home');
        break;
      case 'episode-complete':
        setCurrentScreen('home');
        break;
      case 'report-generation':
        setCurrentScreen('five-day-complete');
        break;
      case 'report-ready':
        setCurrentScreen('report-generation');
        break;
      case 'report-view':
        setCurrentScreen('report-ready');
        break;
      default:
        setCurrentScreen('launch');
    }
  };

  // Render current screen
  switch (state.currentScreen) {
    case 'launch':
      return (
        <LaunchScreen 
          onLogin={handleLogin}
          onNewUser={handleNewUser}
          onClinicianLogin={handleClinicianLogin}
        />
      );

    case 'login':
      return (
        <LoginScreen 
          onLogin={handleLoginSubmit}
          onBack={handleBack}
        />
      );

    case 'clinician-code':
      return (
        <ClinicianCodeScreen 
          onCodeSubmit={handleClinicianCodeSubmit}
          onBack={handleBack}
        />
      );

    case 'clinician-home':
      return (
        <ClinicianHomeScreen 
          onPatientSelect={handlePatientSelect}
          onAddNewPatient={handleAddNewPatient}
        />
      );

    case 'clinician-add-patient':
      return (
        <ClinicianAddPatientScreen 
          onPatientCodeSubmit={handlePatientCodeSubmit}
          onBack={handleBack}
        />
      );

    case 'patient-dashboard':
      return (
        <PatientDashboardScreen 
          patientId={state.selectedPatientId || ''}
          patientDailyTests={state.patientDailyTests}
          onBack={() => setCurrentScreen('clinician-home')}
        />
      );

    case 'patient-code':
      return (
        <PatientCodeScreen 
          onCodeSubmit={handleCodeSubmit}
          onBack={handleBack}
        />
      );

    case 'privacy':
      return (
        <PrivacyScreen 
          onAgree={handlePrivacyAgree}
          onBack={handleBack}
        />
      );

    case 'patient-info':
      return (
        <PatientInfoScreen 
          onSubmit={handlePatientInfoSubmit}
          onBack={handleBack}
          patientCode={state.patient?.patientCode || ''}
        />
      );

    case 'compass-survey':
      return (
        <CompassSurveyScreen 
          onComplete={handleVossComplete}
          onBack={handleBack}
          isBaseline={true}
        />
      );

    case 'medications':
      return (
        <MedicationsScreen 
          onComplete={handleMedicationsComplete}
          onBack={handleBack}
        />
      );

    case 'location-access':
      return (
        <LocationAccessScreen 
          onEnable={handleLocationEnable}
          onSkip={handleLocationSkip}
          onBack={handleBack}
        />
      );

    case 'support-partner':
      return (
        <SupportPartnerScreen 
          onComplete={handleSupportPartnerComplete}
          onBack={handleBack}
        />
      );

    case 'setup-complete':
      return (
        <SetupCompleteScreen 
          onContinue={handleSetupComplete}
        />
      );

    case 'device-connection':
      return (
        <DeviceConnectionScreen 
          onDeviceConnected={handleDeviceConnected}
          onBack={handleBack}
          onSkip={handleDeviceSkip}
        />
      );

    case 'home':
      return (
        <HomeScreen 
          currentDay={state.currentDay}
          totalDays={state.totalBaselineDays}
          dailyTests={state.dailyTests}
          onStartTest={handleStartTest}
          onSymptoms={handleSymptoms}
        />
      );

    case 'intro-to-test':
      return (
        <IntroToTestScreen 
          currentDay={state.currentDay}
          totalDays={state.totalBaselineDays}
          onStartTest={handleNextTestStep}
          onBack={handleBack}
        />
      );

    case 'sit-lie-down':
      return (
        <SitLieDownScreen 
          onNext={handleNextTestStep}
          onCancel={cancelDailyTest}
        />
      );

    case 'time-to-stand':
      return (
        <TimeToStandScreen 
          onComplete={handleCompleteTest}
          onCancel={cancelDailyTest}
        />
      );

    case 'daily-test-complete':
      return (
        <DailyTestCompleteScreen 
          currentDay={state.currentDay}
          totalDays={state.totalBaselineDays}
          onBackToHome={handleBackToHome}
        />
      );

    case 'five-day-complete':
      return (
        <FiveDayCompleteScreen 
          onContinue={handleFiveDayComplete}
        />
      );

    case 'post-baseline-compass':
      return (
        <PostBaselineCompassScreen 
          onComplete={handlePostBaselineVossComplete}
          onBack={handleBack}
        />
      );

    case 'symptom-log':
      return (
        <SymptomLogScreen 
          onLogSymptom={logSymptom}
          onStartEpisode={startEpisode}
          onBack={goToHomeScreen}
          locationEnabled={state.locationEnabled}
        />
      );

    case 'active-episode':
      return state.currentEpisode ? (
        <ActiveEpisodeScreen 
          episode={state.currentEpisode}
          onEndEpisode={endEpisode}
          onUpdateEpisode={updateEpisode}
          onBack={goToHomeScreen}
          locationEnabled={state.locationEnabled}
        />
      ) : (
        <HomeScreen 
          currentDay={state.currentDay}
          totalDays={state.totalBaselineDays}
          dailyTests={state.dailyTests}
          onStartTest={handleStartTest}
          onSymptoms={handleSymptoms}
        />
      );

    case 'episode-complete':
      return state.episodes.length > 0 ? (
        <EpisodeCompleteScreen 
          episode={state.episodes[state.episodes.length - 1]}
          onBackToHome={goToHomeScreen}
        />
      ) : (
        <HomeScreen 
          currentDay={state.currentDay}
          totalDays={state.totalBaselineDays}
          dailyTests={state.dailyTests}
          onStartTest={handleStartTest}
          onSymptoms={handleSymptoms}
        />
      );

    case 'report-generation':
      return (
        <ReportGenerationScreen 
          onReportReady={handleReportReady}
        />
      );

    case 'report-ready':
      return (
        <ReportReadyScreen 
          onViewReport={handleViewReport}
          onDownloadReport={handleDownloadReport}
          onEmailReport={handleEmailReport}
          onShareReport={handleShareReport}
        />
      );

    case 'report-view':
      return state.reportData ? (
        <ReportViewScreen 
          report={state.reportData}
          onBack={handleBack}
          onDownload={handleDownloadReport}
          onEmail={handleEmailReport}
          onShare={handleShareReport}
        />
      ) : (
        <ReportReadyScreen 
          onViewReport={handleViewReport}
          onDownloadReport={handleDownloadReport}
          onEmailReport={handleEmailReport}
          onShareReport={handleShareReport}
        />
      );

    default:
      return (
        <LaunchScreen 
          onLogin={handleLogin}
          onNewUser={handleNewUser}
          onClinicianLogin={handleClinicianLogin}
        />
      );
  }
}

export default App;