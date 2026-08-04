import { recordRecommendationHistory } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 推奨履歴記録', () => {
  // SCEN-1042
  test('推奨履歴が0件の場合、新規レコードが作成される', async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        id: 'rec-001',
        approach: '提案アプローチA',
        reasoning: '根拠説明',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerId: 'cust-123',
      dealAmount: 1000000,
      industry: '製造業',
    };

    const result = await recordRecommendationHistory(
      newDealData,
      mockRecommendationEngine
    );

    expect(result).toEqual({
      id: expect.any(String),
      customerId: 'cust-123',
      recommendation_id: 'rec-001',
      approach: '提案アプローチA',
      reasoning: '根拠説明',
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });

    expect(result.created_at).toEqual(result.updated_at);
    expect(result.recommendation_id).toBe('rec-001');
    expect(result.customerId).toBe('cust-123');
    expect(result.approach).toBe('提案アプローチA');
    expect(result.reasoning).toBe('根拠説明');

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newDealData
    );
  });
});