import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2797
  test('推奨根拠データが未定義のとき、エラーを返す', () => {
    const recommendationData = {
      recommendationId: 'REC-2024-001',
      customerId: 'CUST-12345',
      dealId: 'DEAL-67890',
      recommendationContent: '提案アプローチA',
      confidenceScore: 85,
      recommendationReasoning: null,
      pastSuccessPatterns: [],
      customerData: {
        customerId: 'CUST-12345',
        industryType: '製造業',
        companyScale: '大企業',
      },
      dealConditions: {
        dealId: 'DEAL-67890',
        dealStage: '初期接触',
        budgetRange: '1000万円以上',
      },
    };

    const result = explainRecommendationReasoning(recommendationData);

    expect(result).toEqual({
      success: false,
      error: {
        code: 'RECOMMENDATION_REASONING_UNDEFINED',
        message: '推奨根拠が定義されていません。AIエンジンから根拠説明を取得できませんでした。',
        statusCode: 400,
      },
    });
  });
});