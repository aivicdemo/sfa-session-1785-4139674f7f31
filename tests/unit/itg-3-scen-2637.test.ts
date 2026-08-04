import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2637
  test('根拠情報が空のとき、根拠表示エラーが発生する', () => {
    const recommendationId = 'REC-2024-001';
    const dealId = 'DEAL-2024-001';

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reason: null,
      }),
    };

    const result = explainRecommendationReasoning(
      recommendationId,
      dealId,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      isError: true,
      errorCode: 'EMPTY_REASONING_DATA',
      errorMessage: expect.stringContaining('推奨の根拠情報が取得できませんでした'),
      uiMessage: '根拠情報が利用できません。営業担当者サポートまでお問い合わせください',
    });
  });
});