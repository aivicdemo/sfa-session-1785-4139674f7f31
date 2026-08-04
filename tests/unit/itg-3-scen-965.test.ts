import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-965
  test("推奨根拠の類似度スコアが負数のとき、不正値エラーが返される", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        similarityScore: -0.5,
        isApplicable: false,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const reasoningData = {
      recommendationId: "REC-20250115-001",
      customerId: "CUST-001",
      similarityScore: -0.5,
      basedOnPatterns: [
        {
          patternId: "PAT-001",
          patternName: "早期購買型",
          relevanceScore: 0.85,
        },
      ],
      businessContext: "新規顧客への初回提案",
      recommendedAction: "月末までのフォローアップ提案",
      riskFactors: ["予算制約", "決定権者不在"],
    };

    expect(() =>
      visualizeRecommendationReasoning(reasoningData, mockAIEngine)
    ).toThrow(/INVALID_SIMILARITY_SCORE/);
  });
});