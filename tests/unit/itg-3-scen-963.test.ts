import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-963: 推奨IDが未設定のとき、根拠表示処理が開始されず警告が返される', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const resultWithNullId = explainRecommendationReasoning(
      null,
      mockAIEngine
    );

    expect(resultWithNullId).toEqual({
      code: 'RECOMMENDATION_ID_MISSING',
      message: '推奨IDが設定されていません。根拠を表示できません。',
      severity: 'warning',
    });
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(0);

    jest.clearAllMocks();

    const resultWithUndefinedId = explainRecommendationReasoning(
      undefined,
      mockAIEngine
    );

    expect(resultWithUndefinedId).toEqual({
      code: 'RECOMMENDATION_ID_MISSING',
      message: '推奨IDが設定されていません。根拠を表示できません。',
      severity: 'warning',
    });
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(0);
  });
});