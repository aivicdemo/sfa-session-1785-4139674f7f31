import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨根拠の可視化出力機能', () => {
  // SCEN-2676
  test('推奨根拠の文字列長が0のとき、空として出力される', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue('')
    };

    const recommendationId = 'rec-001';
    const dealId = 'deal-12345';
    const customerId = 'cust-98765';

    const result = explainRecommendationReasoning(
      {
        recommendationId,
        dealId,
        customerId
      },
      mockAIRecommendationEngine
    );

    expect(result).toBe('');
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId,
        dealId,
        customerId
      })
    );
  });
});