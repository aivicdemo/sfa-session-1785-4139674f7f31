import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-860
  test('推奨信頼度スコア算出機能 - 推奨根拠データが複数件のとき信頼度スコアが正しく算出される', () => {
    const evidenceData = [
      {
        relevanceScore: 0.95,
        applicabilityScore: 0.92,
      },
      {
        relevanceScore: 0.87,
        applicabilityScore: 0.85,
      },
      {
        relevanceScore: 0.72,
        applicabilityScore: 0.68,
      },
    ];

    const result = calculateRecommendationConfidenceScore(evidenceData);

    const expectedScore = (0.95 * 0.92 + 0.87 * 0.85 + 0.72 * 0.68) / 3;
    const roundedExpectedScore = Math.round(expectedScore * 1000) / 1000;

    expect(result).toBe(roundedExpectedScore);
    expect(result).toBeGreaterThanOrEqual(0.0);
    expect(result).toBeLessThanOrEqual(1.0);
  });
});