import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨根拠の可視化機能', () => {
  // SCEN-1832
  test('推奨結果IDがnullのとき根拠情報取得に失敗する', () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn((recommendationId: string | null) => {
        if (recommendationId === null) {
          throw new Error('根拠情報の取得に失敗しました');
        }
        return {
          reasoning: '過去事例との類似度が95%以上',
          basis: ['顧客業種一致', '予算規模一致', '成功パターン合致'],
        };
      }),
    };

    const nullRecommendationId = null;

    expect(() => {
      explainRecommendationReasoning(nullRecommendationId, mockAIEngine);
    }).toThrow(/根拠情報の取得に失敗しました/);

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(nullRecommendationId);
  });
});