import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチの自動推奨機能", () => {
  // SCEN-2476
  test("[normal] 顧客条件が指定された場合、その条件を満たす成功パターンのみから提案アプローチが推奨される", () => {
    // 新規案件の顧客条件
    const newCaseCondition = {
      industry: "製造業",
      companySize: "従業員1000名以上",
      budget: 5000000,
      implementationPeriodDays: 90,
    };

    // 推奨パターンマスタ
    const successPatterns = [
      {
        patternId: "A",
        industry: "製造業",
        companySizeThreshold: "従業員500名以上",
        budgetThreshold: 3000000,
        maxImplementationPeriodDays: 180,
        approachDescription: "段階的導入アプローチ",
      },
      {
        patternId: "B",
        industry: "小売業",
        companySizeThreshold: "従業員100名以上",
        budgetThreshold: 2000000,
        maxImplementationPeriodDays: 90,
        approachDescription: "短期導入アプローチ",
      },
      {
        patternId: "C",
        industry: "製造業",
        companySizeThreshold: "従業員1000名以上",
        budgetThreshold: 5000000,
        maxImplementationPeriodDays: 90,
        approachDescription: "エンタープライズ導入アプローチ",
      },
    ];

    // AIRecommendationEngine のスタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn((conditions, patterns) => {
        const filtered = patterns.filter((pattern) => {
          const industryMatch = pattern.industry === conditions.industry;
          const sizeMatch =
            conditions.companySize === "従業員1000名以上" &&
            (pattern.companySizeThreshold === "従業員500名以上" ||
              pattern.companySizeThreshold === "従業員1000名以上");
          const budgetMatch = conditions.budget >= pattern.budgetThreshold;
          const periodMatch =
            conditions.implementationPeriodDays <=
            pattern.maxImplementationPeriodDays;

          return industryMatch && sizeMatch && budgetMatch && periodMatch;
        });

        return {
          recommendedPatterns: filtered,
          confidenceScore: 85,
        };
      }),
    };

    const result = generateRecommendation(
      newCaseCondition,
      successPatterns,
      mockAIEngine
    );

    // 期待結果の検証
    expect(result.recommendedPatterns).toHaveLength(2);
    expect(result.recommendedPatterns.map((p) => p.patternId)).toEqual([
      "A",
      "C",
    ]);

    // すべての推奨パターンが顧客条件を満たすことを確認
    result.recommendedPatterns.forEach((pattern) => {
      expect(pattern.industry).toBe("製造業");
      expect(pattern.budgetThreshold).toBeLessThanOrEqual(5000000);
      expect(pattern.maxImplementationPeriodDays).toGreaterThanOrEqual(90);
    });

    // パターンB（小売業）が除外されていることを確認
    const patternBExists = result.recommendedPatterns.some(
      (p) => p.patternId === "B"
    );
    expect(patternBExists).toBe(false);

    expect(result.confidenceScore).toBe(85);
  });
});