import { generateRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1845
  test("推奨タイミングが null のとき根拠情報の生成に失敗する", () => {
    const recommendationWithNullTiming = {
      recommendedTiming: null,
      recommendedApproach: "提案内容A",
      confidenceScore: 85,
      pastPatterns: [
        {
          patternId: "pattern-001",
          customerId: "cust-123",
          industry: "IT",
          companySize: "mid",
          matchScore: 92
        }
      ],
      successFactors: ["顧客の課題認識", "予算承認済み"],
      riskFactors: ["競合存在"]
    };

    expect(() =>
      generateRecommendationReasoning(recommendationWithNullTiming)
    ).toThrow(/recommendedTiming/);
  });
});