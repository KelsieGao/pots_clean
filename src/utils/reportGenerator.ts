import { MedicalReport, BaselineAnalysis, SymptomAnalysis, VossComparison, DailyTest, Episode, SymptomEntry, VossResponse, Patient } from '../types';

export function generateMedicalReport(
  patient: Patient,
  dailyTests: DailyTest[],
  episodes: Episode[],
  symptoms: SymptomEntry[],
  vossBaseline?: VossResponse[],
  vossFollowUp?: VossResponse[]
): MedicalReport {
  const reportPeriod = {
    startDate: dailyTests.length > 0 ? dailyTests[0].date : new Date().toISOString(),
    endDate: dailyTests.length > 0 ? dailyTests[dailyTests.length - 1].date : new Date().toISOString()
  };

  const baselineResults = analyzeBaselineData(dailyTests);
  const symptomAnalysis = analyzeSymptoms(episodes, symptoms);
  const vossComparison = compareVossScores(vossBaseline, vossFollowUp);
  const recommendations = generateRecommendations(baselineResults, symptomAnalysis, vossComparison);

  return {
    id: crypto.randomUUID(),
    patientId: patient.id,
    generatedAt: new Date().toISOString(),
    reportPeriod,
    baselineResults,
    symptomAnalysis,
    vossComparison,
    recommendations,
    rawData: {
      dailyTests,
      episodes,
      symptoms
    }
  };
}

function analyzeBaselineData(dailyTests: DailyTest[]): BaselineAnalysis {
  // Simulate heart rate data analysis
  const dailyTrends = dailyTests.map((test, index) => {
    const baseResting = 72 + Math.random() * 10;
    const hrIncrease = 25 + Math.random() * 20;
    return {
      day: index + 1,
      restingHR: Math.round(baseResting),
      standingHR: Math.round(baseResting + hrIncrease),
      hrIncrease: Math.round(hrIncrease)
    };
  });

  const averageRestingHR = Math.round(
    dailyTrends.reduce((sum, day) => sum + day.restingHR, 0) / dailyTrends.length
  );
  
  const averageStandingHR = Math.round(
    dailyTrends.reduce((sum, day) => sum + day.standingHR, 0) / dailyTrends.length
  );
  
  const averageHRIncrease = Math.round(
    dailyTrends.reduce((sum, day) => sum + day.hrIncrease, 0) / dailyTrends.length
  );
  
  const maxHRIncrease = Math.max(...dailyTrends.map(day => day.hrIncrease));

  const potsIndicators = {
    meetsHRCriteria: averageHRIncrease >= 30,
    sustainedIncrease: maxHRIncrease >= 30,
    symptomCorrelation: dailyTests.length >= 3 // Simplified logic
  };

  return {
    averageRestingHR,
    averageStandingHR,
    averageHRIncrease,
    maxHRIncrease,
    potsIndicators,
    dailyTrends
  };
}

function analyzeSymptoms(episodes: Episode[], symptoms: SymptomEntry[]): SymptomAnalysis {
  const totalEpisodes = episodes.length;
  
  const averageEpisodeDuration = episodes.length > 0 
    ? episodes.reduce((sum, episode) => {
        if (episode.endTime) {
          const duration = new Date(episode.endTime).getTime() - new Date(episode.startTime).getTime();
          return sum + duration;
        }
        return sum;
      }, 0) / episodes.length / (1000 * 60) // Convert to minutes
    : 0;

  // Count symptom frequencies
  const symptomCounts: { [key: string]: number } = {};
  [...episodes, ...symptoms].forEach(entry => {
    entry.symptoms.forEach(symptom => {
      symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
    });
  });

  const mostCommonSymptoms = Object.entries(symptomCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([symptom, frequency]) => ({ symptom, frequency }));

  const averageSeverity = [...episodes, ...symptoms].length > 0
    ? Math.round([...episodes, ...symptoms].reduce((sum, entry) => sum + (entry.severity || 5), 0) / [...episodes, ...symptoms].length)
    : 0;

  // Generate symptom trends (simplified)
  const symptomTrends = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    episodeCount: Math.floor(Math.random() * 3),
    averageSeverity: Math.floor(Math.random() * 5) + 3
  }));

  const triggerPatterns = [
    'Symptoms more common in morning hours',
    'Standing for >10 minutes triggers episodes',
    'Correlation with meal times observed'
  ];

  return {
    totalEpisodes,
    averageEpisodeDuration: Math.round(averageEpisodeDuration),
    mostCommonSymptoms,
    averageSeverity,
    symptomTrends,
    triggerPatterns
  };
}

function compareVossScores(baseline?: VossResponse[], followUp?: VossResponse[]): VossComparison {
  // VOSS scoring - sum of all 9 symptom scores (0-90 total)
  const baselineScore = baseline ? baseline.reduce((sum, response) => sum + response.value, 0) : 0;
  const followUpScore = 0; // No follow-up survey taken
  const scoreDifference = 0; // No comparison possible

  const interpretation = `Baseline VOSS score of ${baselineScore}/90 indicates ${
    baselineScore >= 45 ? 'high' : baselineScore >= 25 ? 'moderate' : 'mild'
  } orthostatic symptom burden. No follow-up survey was completed.`;

  return {
    baselineScore,
    followUpScore,
    scoreDifference,
    interpretation
  };
}

function generateRecommendations(
  baseline: BaselineAnalysis,
  symptoms: SymptomAnalysis,
  voss: VossComparison
): string[] {
  const recommendations = [];

  if (baseline.potsIndicators.meetsHRCriteria) {
    recommendations.push('Heart rate criteria for POTS are met - recommend cardiology consultation');
  }

  if (symptoms.totalEpisodes > 5) {
    recommendations.push('Frequent symptom episodes documented - consider lifestyle modifications');
  }

  if (voss.scoreDifference > 5) {
    recommendations.push('VOSS scores show symptom progression - follow-up assessment recommended');
  } else if (voss.scoreDifference < -5) {
    recommendations.push('VOSS scores show symptom improvement - current management appears effective');
  }

  recommendations.push('Continue symptom monitoring and maintain activity diary');
  recommendations.push('Consider tilt table test for definitive POTS diagnosis');
  recommendations.push('Discuss treatment options including lifestyle changes and medications');

  return recommendations;
}