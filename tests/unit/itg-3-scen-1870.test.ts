import { explainReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1870
  test('推奨の生成に使用された商談条件が null のとき根拠表示に失敗する', async () => {
    const recommendation_id = 'rec-001';
    const null_deal_condition_error = new Error('商談条件が null のため根拠の生成に失敗しました');

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValue(null_deal_condition_error),
    };

    const mockRecommendationRepository = {
      findById: jest.fn().mockResolvedValue({
        id: recommendation_id,
        customer_id: 'cust-001',
        deal_condition_id: null,
        recommendation_content: 'クラウドサービスの導入を推奨',
        confidence_score: 85,
        created_at: new Date('2024-01-15T11:00:00Z'),
      }),
    };

    const error_thrown = await expect(
      explainReasoning(
        recommendation_id,
        mockAIRecommendationEngine,
        mockRecommendationRepository,
      ),
    ).rejects.toThrow(/商談条件/);

    expect(error_thrown).toBeDefined();
  });
});