import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨信頼度スコア算出機能', () => {
  test('SCEN-868: 過去成功パターン件数が0件のとき信頼度スコアが低下する', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealConditions = {
      industry: 'IT',
      budget: 5000000,
      decisionTimeline: 90,
    };

    mockAIRecommendationEngine.findSimilarPatterns.mockReturnValue([]);

    const scoreWithZeroPatterns = calculateRecommendationConfidenceScore(
      newDealConditions,
      [],
      mockAIRecommendationEngine
    );

    const successPatterns = [
      {
        id: 'pattern_001',
        industry: 'IT',
        budget: 5000000,
        decisionTimeline: 90,
        successRate: 0.85,
      },
      {
        id: 'pattern_002',
        industry: 'IT',
        budget: 4500000,
        decisionTimeline: 100,
        successRate: 0.80,
      },
      {
        id: 'pattern_003',
        industry: 'IT',
        budget: 5500000,
        decisionTimeline: 85,
        successRate: 0.82,
      },
    ];

    mockAIRecommendationEngine.findSimilarPatterns.mockReturnValue(
      successPatterns
    );

    const scoreWithMultiplePatterns = calculateRecommendationConfidenceScore(
      newDealConditions,
      successPatterns,
      mockAIRecommendationEngine
    );

    expect(scoreWithZeroPatterns).toBeGreaterThanOrEqual(0.0);
    expect(scoreWithZeroPatterns).toBeLessThanOrEqual(1.0);
    expect(scoreWithZeroPatterns).toBeLessThan(0.65);
    expect(scoreWithMultiplePatterns).toBeGreaterThan(scoreWithZeroPatterns);
  });
});