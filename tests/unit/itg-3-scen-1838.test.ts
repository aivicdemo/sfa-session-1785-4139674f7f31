import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-1838: 商談IDが null のとき根拠情報取得に失敗する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const invalidDealId = null;

    expect(() => {
      explainRecommendationReasoning(
        invalidDealId,
        mockAIRecommendationEngine
      );
    }).toThrow(/商談ID/);

    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).not.toHaveBeenCalled();
  });
});