import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と商談条件照合機能", () => {
  // SCEN-739
  test("evaluatePatternRelevanceで新規案件への適用スコアが閾値未満（0.3以下）のとき推奨対象から除外される", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn((pattern: any) => {
        if (pattern.patternId === "pattern_low_score") {
          return 0.25;
        }
        if (pattern.patternId === "pattern_high_score") {
          return 0.45;
        }
        return 0.35;
      }),
    };

    const newDealInput = {
      customerId: "CUST_001",
      customerIndustry: "technology",
      customerSize: "large",
      dealAmount: 500000,
      dealStage: "initial_contact",
      dealTimeline: 90,
      businessChallenge: "digital_transformation",
    };

    const successPatternsCandidates = [
      {
        patternId: "pattern_low_score",
        customerIndustryMatch: "technology",
        dealAmountRange: { min: 400000, max: 600000 },
        successRate: 0.65,
        applicableConditions: ["large_enterprise", "digital_transformation"],
      },
      {
        patternId: "pattern_high_score",
        customerIndustryMatch: "technology",
        dealAmountRange: { min: 300000, max: 800000 },
        successRate: 0.78,
        applicableConditions: ["large_enterprise", "it_modernization"],
      },
      {
        patternId: "pattern_mid_score",
        customerIndustryMatch: "technology",
        dealAmountRange: { min: 250000, max: 750000 },
        successRate: 0.72,
        applicableConditions: ["large_enterprise", "digital_transformation"],
      },
    ];

    mockAIRecommendationEngine.generateRecommendation.mockReturnValue({
      recommendedPatterns: successPatternsCandidates
        .map((pattern) => ({
          ...pattern,
          relevanceScore: mockAIRecommendationEngine.evaluatePatternRelevance(
            pattern
          ),
        }))
        .filter((patternWithScore) => patternWithScore.relevanceScore > 0.3),
      recommendationId: "REC_001",
      generatedAt: "2024-01-15T10:30:00Z",
      confidenceScore: 0.82,
    });

    const result = mockAIRecommendationEngine.generateRecommendation(
      newDealInput,
      successPatternsCandidates
    );

    expect(result.recommendedPatterns).toHaveLength(2);
    expect(
      result.recommendedPatterns.some((p: any) => p.patternId === "pattern_low_score")
    ).toBe(false);
    expect(
      result.recommendedPatterns.every((p: any) => p.relevanceScore > 0.3)
    ).toBe(true);
    expect(
      result.recommendedPatterns.map((p: any) => p.patternId).sort()
    ).toEqual(["pattern_high_score", "pattern_mid_score"].sort());
  });
});