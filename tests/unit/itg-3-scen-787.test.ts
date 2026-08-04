import { evaluateRecommendationConfidenceScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨信頼度スコア算出機能", () => {
  // SCEN-787
  test("信頼度スコアがちょうど100のときに正常に返却される", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        confidenceScore: 100,
        isApplicable: true,
      }),
    };

    const customerCondition = {
      industry: "製造業",
      companySize: "large",
      annualRevenue: 5000000000,
      currentChallenge: "生産効率化",
    };

    const dealCondition = {
      dealValue: 10000000,
      dealCycle: "Q2",
      decisionMakerCount: 3,
      competitorPresence: false,
    };

    const result = evaluateRecommendationConfidenceScore(
      customerCondition,
      dealCondition,
      mockAIEngine
    );

    expect(result.confidenceScore).toBe(100);
    expect(typeof result.confidenceScore).toBe("number");
    expect(result.confidenceScore).toEqual(100);
    expect(result.recommendationContent).toBeDefined();
    expect(result.recommendationReasoning).toBeDefined();
    expect(result.hasError).toBe(false);
    expect(result.errorFlag).toBeUndefined();
  });
});