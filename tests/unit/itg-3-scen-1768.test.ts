import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1768
  test('根拠説明文が最大文字数より1文字少ないとき根拠表示内容を返す', async () => {
    const MAX_CHAR_LIMIT = 2000;
    const EXPECTED_CHAR_COUNT = 1999;
    const REASONING_TEXT = 'A'.repeat(EXPECTED_CHAR_COUNT);

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: REASONING_TEXT,
        charCount: EXPECTED_CHAR_COUNT,
      }),
    };

    const result = await explainRecommendationReasoning(
      {
        recommendationId: 'rec-12345',
        dealId: 'deal-67890',
        customerId: 'cust-11111',
      },
      mockAIRecommendationEngine
    );

    expect(result.reasoning).toBe(REASONING_TEXT);
    expect(result.reasoning.length).toBe(EXPECTED_CHAR_COUNT);
    expect(result.reasoning.length).toBeLessThan(MAX_CHAR_LIMIT);
    expect(result.isDisplayed).toBe(true);
    expect(result.charCount).toBe(EXPECTED_CHAR_COUNT);
    expect(result.truncated).toBe(false);
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId: 'rec-12345',
        dealId: 'deal-67890',
        customerId: 'cust-11111',
      })
    );
  });
});