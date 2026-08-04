import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-325
  test('推奨精度がちょうど設定閾値に達した場合、閾値以上として判定される', () => {
    const threshold = 0.75;
    const scoreAtThreshold = 0.75;
    const aiRecommendationEngineStub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(scoreAtThreshold),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendationPattern = {
      patternId: 'pattern-001',
      customerIndustry: 'manufacturing',
      dealSize: 5000000,
      recommendationScore: scoreAtThreshold,
    };

    const result = evaluateRecommendationAccuracy(
      recommendationPattern,
      threshold,
      aiRecommendationEngineStub
    );

    expect(result.isApprovedForDisplay).toBe(true);
    expect(result.evaluatedScore).toBe(0.75);
    expect(result.thresholdComparison).toBe('meets_threshold');
  });
});