import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターンマッチング機能 - 適合度閾値直上のケース", () => {
  // SCEN-1290
  test("適合度80.1%の成功パターンが推奨対象として含まれることを確認", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 80.1,
        isApplicable: true,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "pattern-001",
          customerIndustry: "IT",
          dealAmount: 5000000,
          purchasingDepartment: "Engineering",
          relevanceScore: 80.1,
          isIncludedInRecommendationSet: true,
          successRate: 0.85,
          pastDealCount: 12,
          matchingFactors: ["業種一致", "予算規模適合", "部門合致"],
        },
        {
          patternId: "pattern-002",
          customerIndustry: "Finance",
          dealAmount: 3000000,
          purchasingDepartment: "Operations",
          relevanceScore: 72.5,
          isIncludedInRecommendationSet: true,
          successRate: 0.78,
          pastDealCount: 8,
          matchingFactors: ["業種類似", "予算類似"],
        },
      ]),
    };

    const newDealCondition = {
      customerIndustry: "IT",
      dealAmount: 5000000,
      purchasingDepartment: "Engineering",
      customerScale: "large",
      region: "Tokyo",
    };

    return findSimilarPatterns(newDealCondition, mockAIEngine).then((result) => {
      expect(result).toBeDefined();
      expect(result.patterns).toBeDefined();
      expect(Array.isArray(result.patterns)).toBe(true);

      const targetPattern = result.patterns.find(
        (p: { relevanceScore: number }) => p.relevanceScore === 80.1
      );

      expect(targetPattern).toBeDefined();
      expect(targetPattern.relevanceScore).toBe(80.1);
      expect(targetPattern.isIncludedInRecommendationSet).toBe(true);
      expect(targetPattern.patternId).toBe("pattern-001");
    });
  });
});