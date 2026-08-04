import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-794
  test('推奨信頼度スコア算出機能 - 同じ入力で2回実行したとき、同じ信頼度スコアが返却される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn(() => 0.847),
      generateRecommendation: jest.fn(() => ({
        approach: 'クラウドERP導入提案',
        confidence: 0.847,
      })),
      findSimilarPatterns: jest.fn(() => [
        {
          caseId: 'CASE-001',
          industry: '製造業',
          amount: 5000000,
          product: 'クラウドERP',
          successRate: 0.92,
        },
      ]),
      explainRecommendationReasoning: jest.fn(() => '製造業の同規模企業における成功事例と合致'),
    };

    const dealCondition = {
      customerIndustry: '製造業',
      dealAmount: 5000000,
      proposedProduct: 'クラウドERP',
      customerId: 'CUST-12345',
      dealId: 'DEAL-67890',
    };

    const firstExecutionResult = calculateRecommendationConfidenceScore(
      dealCondition,
      mockAIRecommendationEngine
    );

    const firstConfidenceScore = firstExecutionResult.confidenceScore;

    const secondExecutionResult = calculateRecommendationConfidenceScore(
      dealCondition,
      mockAIRecommendationEngine
    );

    const secondConfidenceScore = secondExecutionResult.confidenceScore;

    expect(firstConfidenceScore).toBe(0.847);
    expect(secondConfidenceScore).toBe(0.847);
    expect(firstConfidenceScore).toBe(secondConfidenceScore);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(2);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerIndustry: '製造業',
        dealAmount: 5000000,
        proposedProduct: 'クラウドERP',
      })
    );
  });
});