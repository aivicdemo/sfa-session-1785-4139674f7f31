import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2798
  test('[error] 推奨根拠の可視化機能 - 推奨IDが欠けているとき、エラーを返す', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const result = explainRecommendationReasoning({
      recommendationId: null,
      aiEngine: mockAIEngine,
    });

    expect(result).toEqual({
      statusCode: 400,
      error: {
        code: 'MISSING_RECOMMENDATION_ID',
        message: '推奨IDは必須です',
      },
      userMessage: '推奨IDが指定されていません。操作をやり直してください',
    });

    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});