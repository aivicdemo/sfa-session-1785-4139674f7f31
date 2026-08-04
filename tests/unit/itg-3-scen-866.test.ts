import { calculateTrustScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('TrustScoreCalculator', () => {
  // SCEN-866
  test('should throw error when customerFitScore is missing', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn(),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const input = {
      pastPatternMatchScore: 85,
      proposalApplicabilityScore: 90,
      customerFitScore: null,
      customerData: {
        industry: 'technology',
        scale: 'enterprise',
        budget: 5000000,
      },
      successPatternData: {
        patternId: 'pattern_001',
        conversionRate: 0.75,
        frequency: 12,
      },
      aiEngine: mockAIRecommendationEngine,
    };

    expect(() => calculateTrustScore(input)).toThrow(/customerFitScore/);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});