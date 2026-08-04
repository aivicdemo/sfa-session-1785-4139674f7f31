import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2808
  test('推奨内容が空文字列のとき、エラーを返す', () => {
    const recommendationId = 'REC-001';
    const recommendation = '';

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const result = explainRecommendationReasoning(
      recommendationId,
      recommendation,
      mockAIEngine
    );

    expect(result).toHaveProperty('error');
    expect(result.error.code).toBe('INVALID_RECOMMENDATION_CONTENT');
    expect(result.error.message).toMatch(
      /推奨内容が空である|推奨内容は必須項目です/
    );
    expect(result.error.statusCode).toBe(400);
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});