import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1833
  test('[error] 推奨根拠の可視化機能 - 推奨結果IDが空文字列のとき根拠情報取得に失敗する', () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const emptyRecommendationId = '';

    expect(() => {
      explainRecommendationReasoning(emptyRecommendationId, mockAIRecommendationEngine);
    }).toThrow(/推奨結果ID/);

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});