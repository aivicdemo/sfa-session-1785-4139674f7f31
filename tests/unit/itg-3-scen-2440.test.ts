import { calculateRecommendationReliabilityScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-2440: 推奨精度スコア算出機能 - AIエージェント推論の信頼度が0のときスコア値0が返却される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        confidence: 0.0,
        relevanceScore: 0
      })
    };

    const testDealData = {
      customerId: 'CUST-001',
      customerName: 'テスト顧客',
      industry: '製造業',
      companySize: 'large',
      dealConditions: {
        dealId: 'DEAL-001',
        dealAmount: 5000000,
        dealStage: 'proposal',
        proposalDate: '2024-01-15T11:00:00Z'
      }
    };

    const result = calculateRecommendationReliabilityScore(
      testDealData,
      mockAIRecommendationEngine
    );

    expect(result).toBe(0);
  });
});