import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターンマスタの統計集計機能', () => {
  // SCEN-316
  test('推奨パターンマスタが0件のとき、デフォルト推奨パターンが返却される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    mockAIEngine.generateRecommendation.mockResolvedValue({
      recommendationId: 'rec_001',
      patternId: 'DEFAULT_PATTERN',
      patternName: 'デフォルト推奨',
      applicabilityScore: 0.5,
      recommendationReason: '利用可能な過去成功パターンがないため、標準推奨パターンを表示しています',
      timestamp: new Date('2024-01-15T11:00:00Z'),
    });

    const customerCondition = {
      customerId: 'cust_001',
      industry: 'manufacturing',
      companySize: 'large',
      budget: 5000000,
      timeline: 'Q1',
    };

    const dealCondition = {
      dealId: 'deal_001',
      dealType: 'new_product',
      previousSuccessRate: 0,
      competitorCount: 3,
    };

    const result = await generateRecommendation(
      customerCondition,
      dealCondition,
      mockAIEngine,
      []
    );

    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
    expect(result.patternId).toBe('DEFAULT_PATTERN');
    expect(result.patternName).toBe('デフォルト推奨');
    expect(result.applicabilityScore).toBe(0.5);
    expect(result.recommendationReason).toBe(
      '利用可能な過去成功パターンがないため、標準推奨パターンを表示しています'
    );
  });
});