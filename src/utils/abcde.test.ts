import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBorderScore,
  evaluateMelanomaRisk,
  calculateSkinMetrics,
  generatePersonalizedRoutine,
  AFFILIATE_PRODUCT_CATALOG
} from './abcde';

test('calculateBorderScore returns low score for smooth circle', () => {
  // A circle of radius 10: Area = 314.159, Perimeter = 62.8318 -> P^2 / (4*pi*A) = 1.0
  const result = calculateBorderScore(62.83, 314.16);
  assert.ok(result.score <= 1.0, `Expected low score, got ${result.score}`);
  assert.match(result.detail, /Smooth, regular border/i);
});

test('calculateBorderScore returns high score for jagged border', () => {
  // A star/jagged shape with large perimeter and small area
  const result = calculateBorderScore(200, 100);
  assert.ok(result.score >= 7.0, `Expected jagged score >= 7.0, got ${result.score}`);
  assert.match(result.detail, /notched/i);
});

test('evaluateMelanomaRisk correctly flags benign lesions', () => {
  const benignResult = evaluateMelanomaRisk({
    asymmetryScore: 1.5,
    asymmetryDetail: 'Bilateral symmetric axes',
    borderScore: 1.8,
    borderDetail: 'Smooth continuous borders',
    colorScore: 2.0,
    colorsIdentified: ['uniform light tan'],
    diameterMm: 3.2,
    diameterScore: 2.0,
    evolutionStatus: 'stable'
  });

  assert.equal(benignResult.riskCategory, 'low');
  assert.equal(benignResult.primaryCondition, 'benign_nevus');
  assert.ok(benignResult.overallScore < 38, `Score was ${benignResult.overallScore}`);
});

test('evaluateMelanomaRisk flags high-risk atypical lesions', () => {
  const highRiskResult = evaluateMelanomaRisk({
    asymmetryScore: 8.5,
    asymmetryDetail: 'Marked asymmetry along both primary and secondary axes',
    borderScore: 8.2,
    borderDetail: 'Scalloped and poorly demarcated edges',
    colorScore: 8.0,
    colorsIdentified: ['dark brown', 'blue-black', 'erythematous pink'],
    diameterMm: 8.4,
    diameterScore: 8.5,
    evolutionStatus: 'rapid_change'
  }, 30, 5.0); // 5mm to 8.4mm in 30 days

  assert.equal(highRiskResult.riskCategory, 'high_attention_needed');
  assert.equal(highRiskResult.primaryCondition, 'melanoma_suspect');
  assert.ok(highRiskResult.overallScore >= 65, `Expected high score >= 65, got ${highRiskResult.overallScore}`);
});

test('calculateSkinMetrics respects physical physiological boundaries', () => {
  const metrics = calculateSkinMetrics({
    rednessChannelAvg: 180,
    blueChannelAvg: 110,
    contrastStdDev: 22,
    luminanceVariance: 15
  });

  assert.ok(metrics.hydration >= 0 && metrics.hydration <= 100);
  assert.ok(metrics.rednessErythema >= 0 && metrics.rednessErythema <= 100);
  assert.ok(metrics.textureSmoothness >= 0 && metrics.textureSmoothness <= 100);
  assert.ok(metrics.barrierHealth >= 0 && metrics.barrierHealth <= 100);
});

test('generatePersonalizedRoutine includes essential AM/PM steps and sunscreen', () => {
  const routine = generatePersonalizedRoutine('sensitive', ['redness', 'barrier_repair']);
  
  assert.ok(routine.amProducts.length >= 3);
  assert.ok(routine.pmProducts.length >= 3);

  // Morning must contain sunscreen
  const hasSpf = routine.amProducts.some(p => p.category === 'sunscreen');
  assert.equal(hasSpf, true, 'AM routine must include SPF defense');

  // All catalog items have valid affiliate links and disclosures
  for (const prod of AFFILIATE_PRODUCT_CATALOG) {
    assert.ok(prod.affiliateUrl.startsWith('https://'));
    assert.ok(prod.retailer.length > 0);
    assert.ok(prod.price.startsWith('$'));
  }
});
