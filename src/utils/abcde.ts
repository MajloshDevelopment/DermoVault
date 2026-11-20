import { AbcdeMetrics, RiskCategory, SkinCondition, SkinMetrics, SkinType, SkincareProduct } from '../types/skin';

/**
 * Calculates Border irregularity based on isoperimetric quotient:
 * P^2 / (4 * PI * Area). Circle = 1.0 (smooth), high value = irregular/notched border.
 */
export function calculateBorderScore(perimeter: number, area: number): { score: number; detail: string } {
  if (area <= 0 || perimeter <= 0) {
    return { score: 1.0, detail: 'Uniform regular circular margins' };
  }
  const compactness = (perimeter * perimeter) / (4 * Math.PI * area);
  // Normalize compactness (1.0 = smooth circle, 2.5+ = highly jagged) to a 0-10 scale
  const rawScore = Math.min(10, Math.max(0, (compactness - 1.0) * 5));
  const rounded = Math.round(rawScore * 10) / 10;
  
  let detail = 'Smooth, regular border with clear demarcation';
  if (rounded >= 7) {
    detail = 'Significant notched, scalloped, or blurred jagged borders';
  } else if (rounded >= 4) {
    detail = 'Mild focal border irregularity with slight contour indentations';
  }
  return { score: rounded, detail };
}

/**
 * Evaluates ABCDE composite score and determines risk category.
 * Melanoma ABCDE rule weighting:
 * Asymmetry (weight 1.3), Border (weight 1.2), Color (weight 1.1), Diameter (weight 1.0), Evolution (weight 1.4)
 */
export function evaluateMelanomaRisk(
  metrics: Omit<AbcdeMetrics, 'overallAbcdeScore'>,
  evolutionDeltaDays: number = 0,
  previousDiameterMm?: number
): { riskCategory: RiskCategory; overallScore: number; primaryCondition: SkinCondition; conditionLabel: string } {
  const { asymmetryScore, borderScore, colorScore, diameterScore } = metrics;
  
  let evolutionScore = 1.0;
  if (previousDiameterMm && previousDiameterMm > 0) {
    const sizeGrowthPercent = ((metrics.diameterMm - previousDiameterMm) / previousDiameterMm) * 100;
    if (sizeGrowthPercent > 15 && evolutionDeltaDays <= 90) {
      evolutionScore = 9.0; // Rapid growth
    } else if (sizeGrowthPercent > 5) {
      evolutionScore = 5.0; // Moderate evolution
    }
  }

  // Weighted total out of 100
  const compositeRaw = (
    asymmetryScore * 2.3 +
    borderScore * 2.2 +
    colorScore * 2.0 +
    diameterScore * 1.5 +
    evolutionScore * 2.0
  );
  const overallScore = Math.min(100, Math.max(5, Math.round(compositeRaw)));

  let riskCategory: RiskCategory = 'low';
  let primaryCondition: SkinCondition = 'benign_nevus';
  let conditionLabel = 'Benign Melanocytic Nevus (Common Mole)';

  if (overallScore >= 65) {
    riskCategory = 'high_attention_needed';
    primaryCondition = 'melanoma_suspect';
    conditionLabel = 'Atypical Pigmented Lesion (Suspicious Features - Prompt Derm Evaluation)';
  } else if (overallScore >= 38) {
    riskCategory = 'moderate';
    primaryCondition = 'dysplastic_nevus';
    conditionLabel = 'Dysplastic Nevus (Atypical Mole with Moderate Asymmetry)';
  } else {
    riskCategory = 'low';
    primaryCondition = 'benign_nevus';
    conditionLabel = 'Benign Nevus (Uniform & Structurally Stable)';
  }

  return { riskCategory, overallScore, primaryCondition, conditionLabel };
}

/**
 * Calculates dermatological skin metrics from localized pixel/histogram signals
 */
export function calculateSkinMetrics(sample: {
  rednessChannelAvg: number; // 0 - 255
  blueChannelAvg: number;
  contrastStdDev: number; // 0 - 50
  luminanceVariance: number;
}): SkinMetrics {
  // Redness / Erythema index
  const rednessRatio = sample.rednessChannelAvg / Math.max(1, (sample.blueChannelAvg + 1));
  const rednessErythema = Math.min(100, Math.max(10, Math.round((rednessRatio - 1.0) * 90)));
  
  // Smoothness inversely related to contrast/edge spikes
  const textureSmoothness = Math.min(100, Math.max(15, Math.round(100 - sample.contrastStdDev * 1.6)));

  // Hydration approximation from micro-reflectance & barrier
  const hydration = Math.min(95, Math.max(25, Math.round(75 - (rednessErythema * 0.3) + (textureSmoothness * 0.25))));

  // Oil balance
  const oilBalance = Math.min(90, Math.max(20, Math.round(50 + (sample.luminanceVariance * 0.4))));

  // Pore visibility
  const poreVisibility = Math.min(90, Math.max(15, Math.round(sample.contrastStdDev * 1.4)));

  // Barrier health
  const barrierHealth = Math.min(100, Math.max(20, Math.round(100 - (rednessErythema * 0.5) - ((100 - hydration) * 0.3))));

  return {
    hydration,
    rednessErythema,
    textureSmoothness,
    oilBalance,
    poreVisibility,
    barrierHealth
  };
}

/**
 * Curated catalog of dermatologist-backed skincare products with affiliate metadata
 */
export const AFFILIATE_PRODUCT_CATALOG: SkincareProduct[] = [
  {
    id: 'prod-gentle-cleanser',
    name: 'Hydrating Ceramide Gentle Cleanser',
    brand: 'Dermalogic Lab',
    category: 'cleanser',
    stepNumber: 1,
    amOrPm: 'both',
    price: '$18.50',
    rating: 4.8,
    reviewCount: 3420,
    activeIngredients: ['Ceramides NP/AP/EOP', 'Hyaluronic Acid', 'Glycerin'],
    keyBenefits: ['Non-foaming barrier support', 'pH balanced 5.5', 'Sulfate-free'],
    affiliateUrl: 'https://partners.dermavault.app/redirect?sku=CLEANSER-CERAMIDE&partner=dermstore',
    retailer: 'DermStore Partner',
    imageUrl: '/src/assets/images/skincare_products_flatlay_1794495427444.jpg',
    matchReason: 'Preserves stratum corneum lipid barrier without stripping natural moisture.'
  },
  {
    id: 'prod-barrier-serum',
    name: '2% B5 + Triple Molecular Hyaluronic Serum',
    brand: 'PureBarrier Clinical',
    category: 'treatment',
    stepNumber: 2,
    amOrPm: 'both',
    price: '$28.00',
    rating: 4.9,
    reviewCount: 2150,
    activeIngredients: ['Multi-depth Hyaluronic Acid', 'Panthenol (Pro-Vitamin B5)', 'Madecassoside'],
    keyBenefits: ['Intense deep hydration', 'Soothes micro-redness', 'Instant plumping effect'],
    affiliateUrl: 'https://partners.dermavault.app/redirect?sku=SERUM-HYA-B5&partner=sephora',
    retailer: 'Sephora Beauty Network',
    imageUrl: '/src/assets/images/skincare_products_flatlay_1794495427444.jpg',
    matchReason: 'Replenishes transepidermal water loss detected in baseline skin scan.'
  },
  {
    id: 'prod-antioxidant-vitc',
    name: '15% Stabilized L-Ascorbic Acid + Ferulic',
    brand: 'Celldermic Science',
    category: 'treatment',
    stepNumber: 2,
    amOrPm: 'am',
    price: '$46.00',
    rating: 4.7,
    reviewCount: 1890,
    activeIngredients: ['15% L-Ascorbic Acid', '1% Vitamin E (Alpha-Tocopherol)', '0.5% Ferulic Acid'],
    keyBenefits: ['Neutralizes UV free radicals', 'Boosts collagen synthesis', 'Fades hyperpigmentation'],
    affiliateUrl: 'https://partners.dermavault.app/redirect?sku=VITC-FERULIC-PRO&partner=dermstore',
    retailer: 'DermStore Partner',
    imageUrl: '/src/assets/images/skincare_products_flatlay_1794495427444.jpg',
    matchReason: 'Shields melanocytes from UV oxidative photoaging and reduces melanin clustering.'
  },
  {
    id: 'prod-mineral-sunscreen',
    name: 'Broad Spectrum SPF 50+ Invisible Zinc Shield',
    brand: 'HelioGuard Rx',
    category: 'sunscreen',
    stepNumber: 4,
    amOrPm: 'am',
    price: '$32.00',
    rating: 4.9,
    reviewCount: 4210,
    activeIngredients: ['20.4% Non-Nano Zinc Oxide', 'Ectoin 1%', 'Bisabolol'],
    keyBenefits: ['Critical UVA/UVB melanoma prevention', 'Non-comedogenic zero white cast', 'Reef-safe'],
    affiliateUrl: 'https://partners.dermavault.app/redirect?sku=SPF50-ZINC-SHIELD&partner=ulta',
    retailer: 'Ulta Partner Network',
    imageUrl: '/src/assets/images/skincare_products_flatlay_1794495427444.jpg',
    matchReason: 'Non-negotiable defense against UV mutation and dysplastic mole progression.'
  },
  {
    id: 'prod-retinoid-pm',
    name: '0.05% Encapsulated Retinaldehyde Night Elixir',
    brand: 'RetinoDerm Precision',
    category: 'treatment',
    stepNumber: 2,
    amOrPm: 'pm',
    price: '$52.00',
    rating: 4.8,
    reviewCount: 1430,
    activeIngredients: ['0.05% Retinaldehyde', 'Centella Asiatica', 'Squalane'],
    keyBenefits: ['11x faster cell conversion than retinol', 'Accelerates cell turnover', 'Smooths dermal texture'],
    affiliateUrl: 'https://partners.dermavault.app/redirect?sku=RETINAL-005&partner=cultbeauty',
    retailer: 'Cult Beauty Affiliates',
    imageUrl: '/src/assets/images/skincare_products_flatlay_1794495427444.jpg',
    matchReason: 'Stimulates cellular turnover and normalizes epidermal keratinization.'
  },
  {
    id: 'prod-lipid-cream',
    name: 'Lipid Replenishing Night Recovery Balm',
    brand: 'Dermalogic Lab',
    category: 'moisturizer',
    stepNumber: 3,
    amOrPm: 'pm',
    price: '$34.00',
    rating: 4.9,
    reviewCount: 3100,
    activeIngredients: ['Physiological 3:1:1 Ceramides-Cholesterol-Fatty Acids', 'Allantoin', 'Colloidal Oat'],
    keyBenefits: ['Repairs stratum corneum overnight', 'Blocks nocturnal TEWL', 'Calms irritated dermis'],
    affiliateUrl: 'https://partners.dermavault.app/redirect?sku=NIGHT-RECOVERY-CREAM&partner=dermstore',
    retailer: 'DermStore Partner',
    imageUrl: '/src/assets/images/skincare_products_flatlay_1794495427444.jpg',
    matchReason: 'Locks in overnight repair and counteracts active treatment peeling.'
  }
];

/**
 * Generates personalized AM and PM regimen based on skin type and risk factors
 */
export function generatePersonalizedRoutine(skinType: SkinType, concerns: string[]): {
  amProducts: SkincareProduct[];
  pmProducts: SkincareProduct[];
  frequencyNotes: string;
} {
  const am = AFFILIATE_PRODUCT_CATALOG.filter(p => p.amOrPm === 'am' || p.amOrPm === 'both');
  const pm = AFFILIATE_PRODUCT_CATALOG.filter(p => p.amOrPm === 'pm' || p.amOrPm === 'both');

  // Sort by stepNumber
  am.sort((a, b) => a.stepNumber - b.stepNumber);
  pm.sort((a, b) => a.stepNumber - b.stepNumber);

  let frequencyNotes = 'Begin active retinoid 2x per week at night, buffering with moisturizer. Daily SPF 50 is mandatory every morning, reapply every 2 hours if outdoors.';
  if (skinType === 'sensitive') {
    frequencyNotes = 'Sensitive skin profile detected: Introduce antioxidant serum every other day. Patch test new products on the inner arm for 24h prior to facial application.';
  } else if (skinType === 'oily') {
    frequencyNotes = 'Balanced lipid formula recommended: Focus on lightweight hydration and non-comedogenic sun protection.';
  }

  return {
    amProducts: am,
    pmProducts: pm,
    frequencyNotes
  };
}
