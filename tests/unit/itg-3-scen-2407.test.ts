import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2407
  test('推論精度スコア算出機能 - 管理職への提示対象データがnullのとき、エラーが発生する', () => {
    const nullPresentationData = null;
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({ score: 75 })
    };

    expect(() =>
      evaluatePatternRelevance(nullPresentationData, mockAIRecommendationEngine)
    ).toThrow(/提示対象データが無効/);
  });
});