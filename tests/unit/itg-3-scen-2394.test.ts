import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2394: 推論精度スコアが100を超える値となったとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(105.5),
    };

    const invalidScoreValue = 105.5;

    expect(() => {
      calculateInferenceAccuracyScore(
        mockAIRecommendationEngine,
        invalidScoreValue
      );
    }).toThrow(/推論精度スコアが100を超えています/);
  });
});