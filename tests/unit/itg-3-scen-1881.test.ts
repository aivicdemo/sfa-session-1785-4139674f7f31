import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1881
  test('抽出された成功パターンが0件のとき推奨生成に失敗する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerInfo = {
      customer_name: 'テスト顧客A',
      industry: '製造業',
      budget_scale: 5000000,
      employee_count: 150,
    };

    const dealConditions = {
      deal_stage: '初期接触',
      product_category: 'システム導入',
      required_implementation_period_days: 90,
      customer_pain_points: ['業務効率化', 'コスト削減'],
    };

    const result = generateRecommendation(customerInfo, dealConditions, mockAIRecommendationEngine);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: '製造業',
        budget_scale: 5000000,
      })
    );

    expect(result).toEqual({
      success: false,
      error_message: '成功パターンが見つかりません。推奨を生成できませんでした',
      recommendation_content: null,
      internal_log: '成功パターン件数: 0、推奨生成スキップ',
    });
  });
});