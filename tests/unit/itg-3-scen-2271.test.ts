import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2271
  test('推奨内容が空のとき、根拠説明文の生成がエラーになる', () => {
    const stubAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: '',
        patterns: [],
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const emptyRecommendationResult = {
      recommendation: '',
      patterns: [],
    };

    expect(() => {
      explainRecommendationReasoning(
        emptyRecommendationResult,
        stubAIRecommendationEngine,
      );
    }).toThrow(/推奨内容/);
  });
});