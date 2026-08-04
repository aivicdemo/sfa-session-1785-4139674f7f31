import { validateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-364
  test('[error] 推奨精度検証機能 - 計測精度値がマイナスのとき、精度検証がエラーになる', () => {
    const negativeAccuracyValue = -0.5;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const validationInput = {
      measuredAccuracy: negativeAccuracyValue,
      aiRecommendationEngine: mockAIRecommendationEngine,
    };

    expect(() => validateRecommendationAccuracy(validationInput)).toThrow(/計測精度値は 0 以上の値である必要があります/);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});