import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1096
  test('参照する成功パターンIDが空文字列のとき、根拠可視化処理がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const emptyPatternId = '';

    expect(() => {
      explainRecommendationReasoning(
        emptyPatternId,
        mockAIEngine
      );
    }).toThrow(/パターンID/);

    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});