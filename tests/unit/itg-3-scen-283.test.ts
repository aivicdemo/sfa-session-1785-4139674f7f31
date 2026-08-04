import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-283
  test('推奨根拠テーブルに記録された根拠情報が0件のとき、「根拠なし」として画面に表示される', async () => {
    const recommendationId = 'rec-001';
    const emptyReasoningList: Array<{
      id: string;
      recommendationId: string;
      reasonType: string;
      reasonContent: string;
      source: string;
      weight: number;
    }> = [];

    const mockAIEngine = {
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue({
          recommendationId,
          reasoning: emptyReasoningList,
          summary: '',
          confidenceScore: 0,
        }),
    };

    const result = await explainRecommendationReasoning(
      recommendationId,
      mockAIEngine
    );

    expect(result).toEqual({
      recommendationId,
      displayText: '根拠なし',
      reasoning: emptyReasoningList,
      isEmptyState: true,
      confidenceScore: 0,
    });

    expect(result.reasoning.length).toBe(0);
    expect(result.displayText).toBe('根拠なし');
    expect(result.isEmptyState).toBe(true);
  });
});