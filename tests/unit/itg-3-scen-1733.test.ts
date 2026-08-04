import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { RecommendationScoreCalculator } from '../../src/logic/it-1-br-3-3-2-1';

describe('RecommendationScoreCalculator', () => {
  let calculator: RecommendationScoreCalculator;
  let mockAIRecommendationEngine: any;

  beforeEach(() => {
    mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn(),
    };
    calculator = new RecommendationScoreCalculator(mockAIRecommendationEngine);
  });

  // SCEN-1733
  test('should calculate recommendability score with confidence score 99.99 as edge case', () => {
    const confidenceScore = 99.99;
    const patternRelevanceScore = 0.98;
    const customerSegment = 'ENTERPRISE';
    const dealStage = 'PROPOSAL';

    mockAIRecommendationEngine.evaluatePatternRelevance.mockReturnValue({
      relevanceScore: patternRelevanceScore,
      matchedPatternCount: 5,
      successRate: 0.92,
    });

    const recommendabilityScore = calculator.calculateRecommendabilityScore({
      confidenceScore,
      patternRelevanceScore,
      customerSegment,
      dealStage,
    });

    expect(recommendabilityScore).toBeGreaterThanOrEqual(0.9799);
    expect(recommendabilityScore).toBeLessThanOrEqual(1.0);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith({
      confidenceScore,
      customerSegment,
      dealStage,
    });
  });
});