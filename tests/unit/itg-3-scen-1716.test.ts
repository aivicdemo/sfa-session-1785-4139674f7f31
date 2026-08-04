import { evaluateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  test('SCEN-1716: 成功パターンマッチ度が-0.1%のとき推奨スコアを0に補正する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(-0.001),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealCondition = {
      customerId: 'C001',
      customerName: '株式会社テスト',
      industry: 'IT',
      companySize: 'large',
      dealSize: 5000000,
      dealStage: 'proposal',
      targetProduct: 'cloud_service',
    };

    const result = evaluateRecommendationScore(dealCondition, mockAIEngine);

    expect(result).toBe(0.0);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(dealCondition);
  });
});