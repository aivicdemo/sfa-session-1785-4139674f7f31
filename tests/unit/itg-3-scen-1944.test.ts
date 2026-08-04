import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1944
  test('根拠説明テキストが空文字列のときに説明なし状態で表示される', async () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
    };

    const recommendationId = 'rec-20240115-001';
    const expectedEmptyStateMarker = '説明なし';

    const result = await explainRecommendationReasoning(
      recommendationId,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      recommendationId: recommendationId,
      reasoning: '',
      displayText: expectedEmptyStateMarker,
      hasExplanation: false,
    });

    expect(result.displayText).toBe(expectedEmptyStateMarker);
    expect(result.hasExplanation).toBe(false);
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationId
    );
  });
});