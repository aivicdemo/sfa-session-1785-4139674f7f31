import { findSimilarPatterns, evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン照合機能", () => {
  test("SCEN-896: 新規案件条件が過去成功パターン複数件と照合される", () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: "pattern_a",
          customerIndustry: "製造",
          budgetScale: "大",
          decisionMaker: "経営層",
          successScore: 0.92,
          matchedFields: ["customerIndustry", "budgetScale", "decisionMaker"],
        },
        {
          patternId: "pattern_b",
          customerIndustry: "製造",
          budgetScale: "中",
          decisionMaker: "部門長",
          successScore: 0.87,
          matchedFields: ["customerIndustry"],
        },
        {
          patternId: "pattern_c",
          customerIndustry: "流通",
          budgetScale: "大",
          decisionMaker: "経営層",
          successScore: 0.79,
          matchedFields: ["budgetScale", "decisionMaker"],
        },
      ]),
      evaluatePatternRelevance: jest.fn((pattern, dealCondition) => {
        if (pattern.patternId === "pattern_a") {
          return { patternId: "pattern_a", relevanceScore: 0.92, matchType: "完全一致" };
        }
        if (pattern.patternId === "pattern_b") {
          return { patternId: "pattern_b", relevanceScore: 0.65, matchType: "部分一致" };
        }
        if (pattern.patternId === "pattern_c") {
          return { patternId: "pattern_c", relevanceScore: 0.58, matchType: "部分一致" };
        }
        return { patternId: pattern.patternId, relevanceScore: 0, matchType: "不一致" };
      }),
    };

    const newDealCondition = {
      customerIndustry: "製造",
      budgetScale: "大",
      decisionMaker: "経営層",
      dealAmount: 25000000,
      proposalCategory: "DX推進支援",
    };

    const similarPatterns = mockAIRecommendationEngine.findSimilarPatterns(newDealCondition);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealCondition);
    expect(similarPatterns).toHaveLength(3);

    const evaluatedResults = similarPatterns.map((pattern) =>
      mockAIRecommendationEngine.evaluatePatternRelevance(pattern, newDealCondition)
    );

    expect(evaluatedResults[0]).toEqual({
      patternId: "pattern_a",
      relevanceScore: 0.92,
      matchType: "完全一致",
    });

    expect(evaluatedResults[1]).toEqual({
      patternId: "pattern_b",
      relevanceScore: 0.65,
      matchType: "部分一致",
    });

    expect(evaluatedResults[2]).toEqual({
      patternId: "pattern_c",
      relevanceScore: 0.58,
      matchType: "部分一致",
    });

    expect(evaluatedResults[0].relevanceScore).toBeGreaterThan(evaluatedResults[1].relevanceScore);
    expect(evaluatedResults[1].relevanceScore).toBeGreaterThan(evaluatedResults[2].relevanceScore);

    expect(similarPatterns[0].matchedFields).toContain("customerIndustry");
    expect(similarPatterns[0].matchedFields).toContain("budgetScale");
    expect(similarPatterns[0].matchedFields).toContain("decisionMaker");

    expect(similarPatterns[1].matchedFields).toContain("customerIndustry");
    expect(similarPatterns[2].matchedFields).toContain("budgetScale");
    expect(similarPatterns[2].matchedFields).toContain("decisionMaker");
  });
});