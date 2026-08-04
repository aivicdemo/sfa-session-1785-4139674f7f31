import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2796
  test('推奨根拠データがnullのとき、エラーを返す', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(null),
    };

    const dealId = 'DEAL-20250801-001';
    const recommendationId = 'REC-12345';

    const result = explainRecommendationReasoning(
      dealId,
      recommendationId,
      mockAIEngine
    );

    expect(result).toEqual({
      statusCode: 400,
      errorCode: 'ERR_REASONING_DATA_NULL',
      errorMessage:
        '推奨根拠データが取得できません。推奨内容を確認するか、後ほど再度お試しください',
      data: null,
    });
  });
});