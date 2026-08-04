import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2623
  test('同じ推奨提案アプローチについて2回根拠表示を実行した場合、同一の根拠データが表示される', async () => {
    const rootReasoningId = 'REASON-20250115-001';
    const expectedReasoningText = '過去12ヶ月の類似案件5件で成功した提案アプローチ。顧客の業種別成功率85%';

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(async (reasoningId: string) => {
        if (reasoningId === rootReasoningId) {
          return {
            reasoningId: rootReasoningId,
            explanation: expectedReasoningText,
            confidence: 85,
          };
        }
        throw new Error('Invalid reasoning ID');
      }),
    };

    const firstCallResult = await explainRecommendationReasoning(
      rootReasoningId,
      mockAIEngine,
    );

    const secondCallResult = await explainRecommendationReasoning(
      rootReasoningId,
      mockAIEngine,
    );

    expect(firstCallResult.explanation).toBe(expectedReasoningText);
    expect(secondCallResult.explanation).toBe(expectedReasoningText);
    expect(firstCallResult.reasoningId).toBe(rootReasoningId);
    expect(secondCallResult.reasoningId).toBe(rootReasoningId);
    expect(firstCallResult.explanation).toEqual(secondCallResult.explanation);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(2);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      rootReasoningId,
    );
  });
});