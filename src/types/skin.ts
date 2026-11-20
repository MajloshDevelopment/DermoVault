export type RiskCategory = 'low' | 'moderate' | 'high_attention_needed';

export type SkinCondition = 
  | 'benign_nevus' 
  | 'dysplastic_nevus' 
  | 'melanoma_suspect' 
  | 'seborrheic_keratosis' 
  | 'healthy_skin' 
  | 'dermatitis_eczema';

export type SkinType = 'normal' | 'dry' | 'oily' | 'combination' | 'sensitive';

export interface AbcdeMetrics {
  asymmetryScore: number; // 0 - 10
  asymmetryDetail: string;
  borderScore: number; // 0 - 10
  borderDetail: string;
  colorScore: number; // 0 - 10
  colorsIdentified: string[];
  diameterMm: number; // in mm
  diameterScore: number; // 0 - 10
  evolutionStatus: 'baseline' | 'stable' | 'slow_growth' | 'rapid_change';
  overallAbcdeScore: number; // 0 - 100
}

export interface SkinMetrics {
  hydration: number; // 0 - 100
  rednessErythema: number; // 0 - 100
  textureSmoothness: number; // 0 - 100
  oilBalance: number; // 0 - 100
  poreVisibility: number; // 0 - 100
  barrierHealth: number; // 0 - 100
}

export interface DifferentialDiagnosisItem {
  condition: string;
  likelihood: 'Low' | 'Medium' | 'High';
  rationale: string;
  urgency: 'Routine check' | 'Next annual visit' | 'Prompt clinical evaluation (within 2-4 weeks)' | 'Immediate dermatologist consultation';
}

export interface HighThinkingAnalysis {
  modelUsed: string;
  thinkingLevel: string;
  thinkingTimestamp: string;
  reasoningTrace: string[];
  differentialDiagnosis: DifferentialDiagnosisItem[];
  activeIngredientSynergies: string[];
  ingredientContraindications: string[];
  clinicalSummary: string;
}

export interface SkinAnalysisRecord {
  id: string;
  timestamp: number;
  bodyLocation: string; // e.g. "Left Forearm", "Cheek", "Upper Back"
  imageUrl: string;
  isEncrypted: boolean;
  isEdgeInference: boolean;
  condition: SkinCondition;
  conditionLabel: string;
  riskCategory: RiskCategory;
  confidence: number; // percentage
  abcde: AbcdeMetrics;
  skinMetrics: SkinMetrics;
  skinType: SkinType;
  primaryConcerns: string[];
  clinicalObservations: string[];
  highThinking?: HighThinkingAnalysis;
  userNotes?: string;
}

export interface SkincareProduct {
  id: string;
  name: string;
  brand: string;
  category: 'cleanser' | 'treatment' | 'moisturizer' | 'sunscreen' | 'exfoliant';
  stepNumber: number;
  amOrPm: 'am' | 'pm' | 'both';
  price: string;
  rating: number;
  reviewCount: number;
  activeIngredients: string[];
  keyBenefits: string[];
  affiliateUrl: string;
  retailer: string;
  imageUrl: string;
  matchReason: string;
}

export interface DailyRoutineItem {
  id: string;
  timeOfDay: 'am' | 'pm';
  stepOrder: number;
  stepName: string;
  product: SkincareProduct;
  completed: boolean;
}

export interface UserConsentLedger {
  biometricImageProcessing: boolean;
  encryptedLocalStorage: boolean;
  anonymizedResearch: boolean;
  affiliateTracking: boolean;
  updatedAt: string;
  consentVersion: string;
}

export interface UserSubscription {
  tier: 'free' | 'pro';
  proActive: boolean;
  billingCycle: 'monthly' | 'annual';
  planName: string;
}
