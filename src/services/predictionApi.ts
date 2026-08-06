/**
 * Prediction API Service
 * 
 * ISOLATION LAYER: This module is the single point of contact for all API calls.
 * Currently returns mocked responses with realistic delays.
 * 
 * TO INTEGRATE WITH REAL BACKEND:
 * Replace the mock logic in predictUTI() with a real fetch() call:
 * 
 *   const response = await fetch('http://your-backend-url/api/predict', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(patientData)
 *   });
 *   return response.json();
 * 
 * No component changes will be required—just update this file.
 */

export interface PatientData {
  // Urinalysis Parameters
  leukocyteEsterase: 'negative' | 'trace' | 'plus1' | 'plus2' | 'plus3';
  nitrite: 'positive' | 'negative';
  wbcUrinalysis: number;       // WBC /hpf in urinalysis
  redBloodCell: number;        // RBC /hpf
  bacteria: 'none' | 'few' | 'moderate' | 'many';
  urinePh: number;
  specificGravity: number;
  protein: string;
  glucose: string;
  whiteBloodCell: number;      // Blood WBC ×10³/μL

  // Blood Results & Vitals
  serumCreatinine: number;     // mg/dL
  temperature: number;         // °C
  symptomDuration: number;     // days

  // Patient Demographics & History
  age: number;
  gender: 'male' | 'female';
  priorUti: 'yes' | 'no' | '';
  catheterUse: 'yes' | 'no' | '';
  pregnancy: 'yes' | 'no' | 'na' | '';

  // Legacy symptom fields (kept for mock logic)
  dysuria: boolean;
  frequency: boolean;
  urgency: boolean;
  flankPain: boolean;
  fever: boolean;
}

export interface FeatureImportance {
  feature: string;
  weight: number;
}

export interface RocPoint {
  fpr: number;
  tpr: number;
}

export interface PredictionResult {
  prediction: 'likely_uti' | 'unlikely_uti';
  confidence: number; // 0-100
  featureImportance: FeatureImportance[];
  rocCurve: RocPoint[];
  modelInfo: {
    name: string;
    description: string;
  };
}

/**
 * Mock prediction logic that generates clinically plausible results
 * based on input features. This simulates what the backend would do.
 */
function generateMockPrediction(patientData: PatientData): PredictionResult {
  // Calculate risk factors
  let riskScore = 0;

  // Strong indicators
  if (patientData.leukocyteEsterase !== 'negative') {
    riskScore += 25;
  }
  if (patientData.nitrite === 'positive') {
    riskScore += 25;
  }
  if (patientData.whiteBloodCell > 5) {
    riskScore += 15;
  }

  // Moderate indicators
  if (patientData.redBloodCell > 3) {
    riskScore += 10;
  }
  if (patientData.protein !== 'negative' && patientData.protein !== '') {
    riskScore += 8;
  }

  // Symptom-based indicators
  if (patientData.dysuria) riskScore += 5;
  if (patientData.frequency) riskScore += 5;
  if (patientData.urgency) riskScore += 5;
  if (patientData.flankPain) riskScore += 10;
  if (patientData.fever) riskScore += 8;

  // Age and gender factors (simplified heuristic)
  if (patientData.gender === 'female' && patientData.age < 50) {
    riskScore += 3;
  }

  // Clamp to 0-100
  const confidence = Math.min(100, Math.max(0, riskScore));

  // Generate feature importance based on actual input
  const features: FeatureImportance[] = [
    {
      feature: 'Leukocyte Esterase',
      weight: patientData.leukocyteEsterase !== 'negative' ? 0.28 : 0.08,
    },
    {
      feature: 'WBC (urinalysis)',
      weight: Math.min(0.22, (patientData.wbcUrinalysis || 0) / 40),
    },
    {
      feature: 'Nitrite',
      weight: patientData.nitrite === 'positive' ? 0.20 : 0.05,
    },
    {
      feature: 'Bacteria',
      weight: patientData.bacteria === 'many' ? 0.16 : patientData.bacteria === 'moderate' ? 0.10 : patientData.bacteria === 'few' ? 0.05 : 0.01,
    },
    {
      feature: 'Blood WBC',
      weight: Math.min(0.12, patientData.whiteBloodCell / 30),
    },
    {
      feature: 'Symptom Duration',
      weight: Math.min(0.10, (patientData.symptomDuration || 0) / 20),
    },
    {
      feature: 'RBC / Haematuria',
      weight: Math.min(0.09, (patientData.redBloodCell || 0) / 50),
    },
    {
      feature: 'Prior UTI',
      weight: patientData.priorUti === 'yes' ? 0.08 : 0.02,
    },
  ];

  // Sort by weight and take top 6-8
  const sortedFeatures = features
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 8);

  // Normalize weights to sum to 1
  const totalWeight = sortedFeatures.reduce((sum, f) => sum + f.weight, 0);
  const normalizedFeatures = sortedFeatures.map((f) => ({
    ...f,
    weight: Math.round((f.weight / totalWeight) * 100) / 100,
  }));

  // Generate representative ROC curve (static, model-level)
  const rocCurve: RocPoint[] = [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.05, tpr: 0.35 },
    { fpr: 0.1, tpr: 0.65 },
    { fpr: 0.15, tpr: 0.8 },
    { fpr: 0.2, tpr: 0.88 },
    { fpr: 0.3, tpr: 0.93 },
    { fpr: 0.5, tpr: 0.97 },
    { fpr: 0.7, tpr: 0.99 },
    { fpr: 1.0, tpr: 1.0 },
  ];

  return {
    prediction: confidence >= 50 ? 'likely_uti' : 'unlikely_uti',
    confidence,
    featureImportance: normalizedFeatures,
    rocCurve,
    modelInfo: {
      name: 'GA-GWO Hybrid Tuned Random Forest',
      description:
        'Genetic Algorithm + Grey Wolf Optimizer hybrid ensemble classifier trained on urinalysis and demographic data.',
    },
  };
}

/**
 * Main prediction endpoint (isolated, mocked, ready for backend integration)
 * @param patientData - Patient urinalysis and demographic information
 * @returns Promise resolving to prediction result with analytics
 */
export async function predictUTI(
  patientData: PatientData
): Promise<PredictionResult> {
  // Simulate network latency (800ms typical)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // INTEGRATION POINT:
  // Replace the following with an actual fetch() call to your FastAPI backend.
  // The response structure must match PredictionResult interface above.
  //
  // Example real backend call:
  // const response = await fetch('http://localhost:8000/api/predict', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(patientData),
  // });
  //
  // if (!response.ok) {
  //   throw new Error(`Prediction failed: ${response.statusText}`);
  // }
  //
  // return response.json();

  // For now, return clinically plausible mock data
  return generateMockPrediction(patientData);
}

/**
 * Validation helper (optional, can be used by components)
 */
export function validatePatientData(data: Partial<PatientData>): string[] {
  const errors: string[] = [];

  if (!data.age || data.age < 0 || data.age > 150) {
    errors.push('Age must be between 0 and 150.');
  }

  if (!data.gender) {
    errors.push('Gender is required.');
  }

  if (
    !data.urinePh ||
    data.urinePh < 4.5 ||
    data.urinePh > 8.5
  ) {
    errors.push('Urine pH must be between 4.5 and 8.5.');
  }

  if (
    !data.specificGravity ||
    data.specificGravity < 1.0 ||
    data.specificGravity > 1.03
  ) {
    errors.push('Specific gravity must be between 1.0 and 1.03.');
  }

  return errors;
}
