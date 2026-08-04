import { validateLearningDataQualityAndAuthorizeInference } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論実行前の学習データ品質検証', () => {
  // SCEN-028
  test('学習データ品質スコアがちょうど良好閾値に達した場合に推論実行が許可される', () => {
    const QUALITY_THRESHOLD = 0.70;
    const qualityScore = 0.70;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: 'Standard Approach A',
        confidence: 0.95,
        reasoning: 'Based on similar successful patterns',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = validateLearningDataQualityAndAuthorizeInference(
      qualityScore,
      QUALITY_THRESHOLD,
      mockAIRecommendationEngine,
    );

    expect(result.isInferenceAuthorized).toBe(true);
    expect(result.qualityScore).toBe(0.70);
    expect(result.thresholdMet).toBe(true);
    expect(result.message).toMatch(/推論実行/);
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});