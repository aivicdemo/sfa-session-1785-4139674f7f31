import { calculateRecommendationAccuracyScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能', () => {
  // SCEN-2445
  test('商談の成功確率が0%のときスコア計算に最小値として反映される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.0),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const inputDealData = {
      customerId: 'CUST-001',
      customerIndustry: 'manufacturing',
      customerScale: 'medium',
      dealCondition: {
        dealStage: 'initial_contact',
        dealValue: 500000,
        dealTimeline: 90,
      },
      pastPatterns: [
        {
          patternId: 'pattern-001',
          successRate: 0.75,
          matchingScore: 0.65,
        },
      ],
    };

    const result = calculateRecommendationAccuracyScore(
      inputDealData,
      mockAIRecommendationEngine
    );

    expect(result.accuracyScore).toBe(0.0);
    expect(result.isMinimumThreshold).toBe(true);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-001',
        dealCondition: inputDealData.dealCondition,
      })
    );
  });
});