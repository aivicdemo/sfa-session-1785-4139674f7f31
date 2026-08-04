import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1097
  test("類似パターンの適用可能性スコアが null のとき、根拠可視化処理がエラーになる", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        patternId: "pattern-001",
        relevanceScore: null,
        matchedAttributes: ["industry", "scale"],
      }),
      explainRecommendationReasoning: jest.fn(),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
    };

    const recommendationBasis = {
      recommendationId: "rec-001",
      customerId: "cust-001",
      dealId: "deal-001",
      similarPatterns: [
        {
          patternId: "pattern-001",
          successRate: 0.75,
          applicabilityScore: null,
          relatedDealIds: ["deal-past-001", "deal-past-002"],
        },
      ],
      successCriteria: {
        industryMatch: true,
        scaleMatch: true,
        processAlignment: 0.8,
      },
      generatedAt: "2024-01-15T10:00:00Z",
    };

    expect(() =>
      explainRecommendationReasoning(recommendationBasis, mockAIEngine)
    ).toThrow(/適用可能性スコア/);
  });
});