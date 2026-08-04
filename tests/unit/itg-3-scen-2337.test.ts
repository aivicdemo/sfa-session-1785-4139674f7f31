import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2337
  test('推奨根拠説明生成 - 推奨内容データが欠落しているとき説明文生成が中断される', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        explanation: null,
        error: {
          code: 'MISSING_RECOMMENDATION_DATA',
          message: '推奨内容の必須データ（顧客情報）が欠落しています'
        }
      })
    };

    const recommendationData = {
      recommendationId: 'REC-2337',
      dealConditions: {
        industry: 'IT',
        budget: 50000
      },
      recommendedApproach: '提案タイプA',
      similarPatterns: ['PATTERN-001', 'PATTERN-002']
    };

    const missingCustomerInfo = {
      customerId: null,
      customerName: null,
      contactPerson: null
    };

    const result = explainRecommendationReasoning(
      recommendationData,
      missingCustomerInfo,
      mockAIEngine
    );

    expect(result.error).toBeDefined();
    expect(result.error.code).toBe('MISSING_RECOMMENDATION_DATA');
    expect(result.error.message).toBe('推奨内容の必須データ（顧客情報）が欠落しています');
    expect(result.explanation).toBeNull();
    expect(result.partialExplanation).toBeUndefined();
  });
});