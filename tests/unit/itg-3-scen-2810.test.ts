import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2810
  test('推奨内容の根拠情報が空配列のとき、エラーを返す', () => {
    const recommendationId = 'REC-20240115-001';
    const emptyReasoningData = [];

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        recommendationId: recommendationId,
        reasoning: emptyReasoningData,
      }),
    };

    const result = explainRecommendationReasoning(
      recommendationId,
      emptyReasoningData,
      mockAIRecommendationEngine
    );

    expect(result.errorCode).toBe('EMPTY_REASONING_DATA');
    expect(result.statusCode).toBe(400);
    expect(result.errorMessage).toBe('推奨内容の根拠情報が取得できません');
    expect(result.userMessage).toBe(
      '根拠情報を生成できませんでした。AIエンジンに遅延が発生しています'
    );
    expect(result.systemLog).toContain('根拠情報が空配列のため処理を中断');
  });
});