import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と新規案件への提案アプローチ推奨機能", () => {
  // SCEN-2070
  test("同じ新規案件条件で提案推奨を2回実行した場合、同じ推奨結果が返却される（冪等性）", () => {
    const newBusinessCondition = {
      customerIndustry: "製造業",
      businessChallenge: "DX推進",
      budgetScale: 5000000,
      decisionTimeline: "3ヶ月以内",
    };

    const stubRecommendationResult = {
      recommendedApproach: "経営層への価値提案",
      relevanceScore: 0.94,
      similarPatterns: [
        {
          patternId: "SP001",
          companyName: "A製造会社",
          applicabilityScore: 0.96,
          implementationDays: 45,
        },
        {
          patternId: "SP002",
          companyName: "B電機工業",
          applicabilityScore: 0.92,
          implementationDays: 52,
        },
        {
          patternId: "SP003",
          companyName: "C化学",
          applicabilityScore: 0.89,
          implementationDays: 38,
        },
        {
          patternId: "SP004",
          companyName: "D重工",
          applicabilityScore: 0.91,
          implementationDays: 48,
        },
        {
          patternId: "SP005",
          companyName: "E自動車部品",
          applicabilityScore: 0.88,
          implementationDays: 55,
        },
      ],
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest
        .fn()
        .mockReturnValue(stubRecommendationResult),
    };

    const result1 = generateRecommendation(
      newBusinessCondition,
      mockAIRecommendationEngine
    );

    const result2 = generateRecommendation(
      newBusinessCondition,
      mockAIRecommendationEngine
    );

    expect(result1.recommendedApproach).toBe(result2.recommendedApproach);
    expect(result1.recommendedApproach).toBe("経営層への価値提案");

    expect(result1.relevanceScore).toBe(result2.relevanceScore);
    expect(result1.relevanceScore).toBe(0.94);

    expect(result1.similarPatterns.length).toBe(result2.similarPatterns.length);
    expect(result1.similarPatterns.length).toBe(5);

    for (let i = 0; i < result1.similarPatterns.length; i++) {
      expect(result1.similarPatterns[i].patternId).toBe(
        result2.similarPatterns[i].patternId
      );
      expect(result1.similarPatterns[i].companyName).toBe(
        result2.similarPatterns[i].companyName
      );
      expect(result1.similarPatterns[i].applicabilityScore).toBe(
        result2.similarPatterns[i].applicabilityScore
      );
      expect(result1.similarPatterns[i].implementationDays).toBe(
        result2.similarPatterns[i].implementationDays
      );
    }

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(
      2
    );
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newBusinessCondition
    );
  });
});