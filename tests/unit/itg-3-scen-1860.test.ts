import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1860: [error] 推奨内容の根拠表示機能 - 推奨内容IDが空文字列のとき根拠表示に失敗する
  test('推奨内容IDが空文字列のとき、入力値検証エラーをスローし、外部API呼び出しが発生しない', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error('推奨内容が見つかりません')
      ),
    };

    const recommendationId = '';

    expect(() =>
      explainRecommendationReasoning(recommendationId, mockAIEngine)
    ).toThrow(/推奨内容が見つかりません/);

    expect(
      mockAIEngine.explainRecommendationReasoning
    ).not.toHaveBeenCalled();
  });
});