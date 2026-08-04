import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1814
  test('[normal] 推奨内容の根拠説明機能 - 根拠説明が複数回生成されても同じ内容が返却される（べき等性）', () => {
    const recommendationId = 'REC-2024-001';
    const expectedReasoningContent = '顧客の課題X、過去成功事例Y、提案アプローチZに基づいた推奨です。';

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn((recId: string) => {
        if (recId === recommendationId) {
          return {
            recommendationId: recId,
            reasoning: expectedReasoningContent,
            timestamp: '2024-01-15T11:00:00Z',
          };
        }
        throw new Error('推奨ID');
      }),
    };

    const reasoningResult1 = mockAIRecommendationEngine.explainRecommendationReasoning(
      recommendationId
    );
    const reasoningResult2 = mockAIRecommendationEngine.explainRecommendationReasoning(
      recommendationId
    );
    const reasoningResult3 = mockAIRecommendationEngine.explainRecommendationReasoning(
      recommendationId
    );

    expect(reasoningResult1).toEqual(reasoningResult2);
    expect(reasoningResult2).toEqual(reasoningResult3);

    expect(reasoningResult1.reasoning).toBe(expectedReasoningContent);
    expect(reasoningResult1.reasoning).toBe('顧客の課題X、過去成功事例Y、提案アプローチZに基づいた推奨です。');

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      1,
      recommendationId
    );
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      2,
      recommendationId
    );
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      3,
      recommendationId
    );
  });
});