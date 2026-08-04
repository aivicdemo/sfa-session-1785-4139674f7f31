import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-964
  test('推奨IDが空文字列のとき、根拠表示処理が開始されず警告が返される', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const result = explainRecommendationReasoning('', mockAIEngine);

    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      errorCode: 'INVALID_RECOMMENDATION_ID',
      message: '推奨IDが指定されていません',
    });
  });
});