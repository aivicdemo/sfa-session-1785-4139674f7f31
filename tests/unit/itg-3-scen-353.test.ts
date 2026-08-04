import { validateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-353
  test('推奨根拠が空配列のとき、精度検証がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(() => ({
        recommendation: '提案内容',
        reasoning: []
      })),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const recommendationInput = {
      recommendation: '提案内容',
      reasoning: []
    };

    const result = validateRecommendationAccuracy(recommendationInput, mockAIEngine);

    expect(result).toEqual({
      name: 'ValidationError',
      message: '推奨根拠が空です。精度検証を実行できません',
      code: 'EMPTY_REASONING_ARRAY'
    });

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});