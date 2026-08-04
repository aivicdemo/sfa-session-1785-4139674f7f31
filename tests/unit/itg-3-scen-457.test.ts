import { calculatePrioritizationScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度スコアリング機能', () => {
  // SCEN-457
  test('エラー件数が閾値直上の場合、優先度スコアが正しく算出される', () => {
    const ERROR_THRESHOLD = 100;
    const ERROR_COUNT_ABOVE_THRESHOLD = 101;
    const BASE_SCORE = 50;
    const WEIGHT_COEFFICIENT = 2.0;
    const EXPECTED_SCORE_AT_THRESHOLD = 50.0;
    const EXPECTED_SCORE_ABOVE_THRESHOLD = 52.0;
    const EXPECTED_DIFFERENCE = 2.0;

    const prioritizationInputAboveThreshold = {
      errorCount: ERROR_COUNT_ABOVE_THRESHOLD,
      errorThreshold: ERROR_THRESHOLD,
      baseScore: BASE_SCORE,
      weightCoefficient: WEIGHT_COEFFICIENT,
      improvementEffectExpectancy: 0.8,
      implementationDifficulty: 0.6,
      customerImpactDegree: 0.7,
    };

    const prioritizationInputAtThreshold = {
      errorCount: ERROR_THRESHOLD,
      errorThreshold: ERROR_THRESHOLD,
      baseScore: BASE_SCORE,
      weightCoefficient: WEIGHT_COEFFICIENT,
      improvementEffectExpectancy: 0.8,
      implementationDifficulty: 0.6,
      customerImpactDegree: 0.7,
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.9),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const scoreAboveThreshold = calculatePrioritizationScore(
      prioritizationInputAboveThreshold,
      mockAIRecommendationEngine
    );

    const scoreAtThreshold = calculatePrioritizationScore(
      prioritizationInputAtThreshold,
      mockAIRecommendationEngine
    );

    expect(scoreAboveThreshold).toBe(EXPECTED_SCORE_ABOVE_THRESHOLD);
    expect(scoreAtThreshold).toBe(EXPECTED_SCORE_AT_THRESHOLD);
    expect(scoreAboveThreshold - scoreAtThreshold).toBe(EXPECTED_DIFFERENCE);
  });
});