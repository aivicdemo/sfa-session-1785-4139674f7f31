import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-2-1-1';

describe('推奨精度スコア算出機能', () => {
  // SCEN-2437
  test('根拠情報が0件のときスコアが算出されない', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: '提案アプローチA',
        recommendedTiming: '2024-06-15',
        suggestedQuantity: 100,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.8),
    };

    const dealCondition = {
      customerId: 'CUST-001',
      customerName: '顧客A',
      industry: '製造業',
      employeeCount: 500,
      proposalContent: '提案内容X',
      dealStage: 'Initial Contact',
      proposedAmount: 5000000,
      proposedTimeline: '2024-Q3',
    };

    const result = await calculateRecommendationScore(
      dealCondition,
      mockAIEngine
    );

    expect(result.reasoningBases).toEqual([]);
    expect(result.reasoningBasesCount).toBe(0);
    expect(result.confidenceScore).toBeNull();
    expect(result.recommendation).toEqual({
      proposalApproach: '提案アプローチA',
      recommendedTiming: '2024-06-15',
      suggestedQuantity: 100,
    });
  });
});