import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  test('SCEN-1712: 成功パターンマッチ度が99.9%のとき推奨スコアを99.9で計算する', () => {
    // Arrange: AIRecommendationEngine のスタブを作成
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        matchScore: 99.9,
        confidence: 0.95,
        applicablePatterns: [
          {
            patternId: 'pattern-001',
            name: '大企業向け複数年契約提案',
            relevanceScore: 99.9,
          },
        ],
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealConditions = {
      customerId: 'cust-12345',
      customerIndustry: 'IT',
      customerScale: 'large',
      productCategory: 'enterprise_solution',
      dealAmount: 5000000,
      dealStage: 'proposal',
      competitorPresence: true,
      decisionMakerAvailable: true,
      previousPurchaseHistory: true,
    };

    // Act: 推奨妥当性スコア算出機能を呼び出し
    const result = evaluateRecommendationRelevance(dealConditions, mockAIEngine);

    // Assert: 推奨スコアが正確に 99.9 であることを検証
    expect(result).toHaveProperty('recommendationScore');
    expect(result.recommendationScore).toBe(99.9);
    expect(result.recommendationScore).toStrictEqual(99.9);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(dealConditions);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
  });
});