import { calculateRecommendationConfidenceScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-879: 推奨信頼度スコア算出機能 - 推奨生成日と提示日が月をまたぐとき信頼度スコアが正しく減衰される", () => {
    const generatedAt = new Date("2025-01-15T10:00:00Z");
    const presentedAt = new Date("2025-02-15T10:00:00Z");
    const initialConfidenceScore = 0.95;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        confidenceScore: initialConfidenceScore,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const daysDifference = 31;
    const dailyDecayRate = 0.05;
    const decayedScore = initialConfidenceScore * (1 - dailyDecayRate * daysDifference);
    const expectedConfidenceScore = Math.max(0, decayedScore);

    const actualScore = calculateRecommendationConfidenceScore(
      generatedAt,
      presentedAt,
      initialConfidenceScore,
      mockAIRecommendationEngine
    );

    expect(actualScore).toBe(expectedConfidenceScore);
  });
});