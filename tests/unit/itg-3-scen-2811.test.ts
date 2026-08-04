import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-2811: 推奨内容の根拠タイプが不正な値のとき、エラーを返す', async () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        recommendationId: 'REC-001',
        reasoningType: 'INVALID_TYPE',
        explanation: 'Some explanation',
        confidenceScore: 85,
      }),
    };

    const result = await displayRecommendationReasoning(
      { recommendationId: 'REC-001' },
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      success: false,
      errorCode: 'INVALID_REASONING_TYPE',
      errorMessage: '根拠タイプが不正です',
      httpStatusCode: 400,
      userDisplayMessage: '根拠の表示に失敗しました。管理者にお問い合わせください',
    });
  });
});