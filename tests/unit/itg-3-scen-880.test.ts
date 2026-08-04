import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-880
  test('推奨生成日が月末で提示日が月初のとき信頼度スコアが正しく計算される', () => {
    const recommendationGeneratedAt = new Date('2024-01-31T23:59:59Z');
    const presentedAt = new Date('2024-02-01T00:00:00Z');
    const patternRelevanceScore = 0.75;

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(patternRelevanceScore),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const result = calculateRecommendationConfidenceScore(
      recommendationGeneratedAt,
      presentedAt,
      patternRelevanceScore,
      mockAIEngine
    );

    expect(result).toBe(0.675);
  });
});