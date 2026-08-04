import { calculateRecommendationConfidenceScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2441: [edge] 推奨精度スコア算出機能 - AIエージェント推論の信頼度が50のときスコア値50が返却される
  test("should return confidence score of 50 when AI agent recommendation trust level is 50", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        confidenceScore: 50,
        relevanceFactors: [],
      }),
    };

    const recommendationResult = {
      recommendedApproach: "customer-centric-proposal",
      timingWindow: "immediate",
      estimatedSuccessProbability: 50,
      confidenceLevel: 50,
    };

    const result = calculateRecommendationConfidenceScore(
      recommendationResult,
      mockAIEngine
    );

    expect(result).toBe(50);
  });
});