import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と提案アプローチ推奨機能", () => {
  // SCEN-2230
  test("類似度スコアが1.0（完全一致）のパターンが優先度最高で推奨される", async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "pattern-001",
          customerIndustry: "manufacturing",
          budgetRange: "1M-5M",
          dealStage: "proposal",
          similarityScore: 1.0,
          successRate: 0.95,
          patternName: "Perfect Match Manufacturing Pattern",
        },
        {
          patternId: "pattern-002",
          customerIndustry: "manufacturing",
          budgetRange: "1M-5M",
          dealStage: "qualification",
          similarityScore: 0.95,
          successRate: 0.88,
          patternName: "High Similarity Manufacturing Pattern",
        },
        {
          patternId: "pattern-003",
          customerIndustry: "manufacturing",
          budgetRange: "500K-2M",
          dealStage: "proposal",
          similarityScore: 0.95,
          successRate: 0.87,
          patternName: "Alternative Manufacturing Pattern",
        },
        {
          patternId: "pattern-004",
          customerIndustry: "technology",
          budgetRange: "2M-8M",
          dealStage: "negotiation",
          similarityScore: 0.8,
          successRate: 0.82,
          patternName: "Lower Similarity Pattern",
        },
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealCondition = {
      customerId: "CUST-2024-001",
      customerIndustry: "manufacturing",
      customerSize: "large",
      budgetRange: "1M-5M",
      dealStage: "proposal",
      productCategory: "ERP",
      timelineWeeks: 8,
      decisionMaker: "CTO",
      currentChallenge: "process automation",
    };

    const result = await generateRecommendation(
      newDealCondition,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.recommendations).toBeDefined();
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);

    const firstRecommendation = result.recommendations[0];
    expect(firstRecommendation.patternId).toBe("pattern-001");
    expect(firstRecommendation.similarityScore).toBe(1.0);
    expect(firstRecommendation.recommendationPriority).toBe("HIGHEST");
    expect(firstRecommendation.patternName).toBe("Perfect Match Manufacturing Pattern");

    expect(result.recommendations[1].similarityScore).toBe(0.95);
    expect(result.recommendations[1].recommendationPriority).toBe("HIGH");

    expect(result.recommendations[2].similarityScore).toBe(0.95);
    expect(result.recommendations[2].recommendationPriority).toBe("HIGH");

    expect(result.recommendations[3].similarityScore).toBe(0.8);
    expect(result.recommendations[3].recommendationPriority).toBe("MEDIUM");

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
  });
});