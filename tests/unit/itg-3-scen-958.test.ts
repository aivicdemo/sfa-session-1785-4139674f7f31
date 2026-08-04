import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ推奨生成機能 - AIエージェント推奨エンジン", () => {
  // SCEN-958
  test("APIエラー時に内部推奨パターンマスタから統計的上位パターンを返却", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error("429 Rate Limit"))
        .mockRejectedValueOnce(new Error("429 Rate Limit"))
        .mockRejectedValueOnce(new Error("500 Internal Server Error")),
    };

    const recommendationPatternMaster = [
      {
        id: "pattern_a",
        name: "パターンA",
        successRate: 85,
        usageCount: 120,
        description: "IT業界向け高速提案アプローチ",
      },
      {
        id: "pattern_b",
        name: "パターンB",
        successRate: 78,
        usageCount: 95,
        description: "標準提案アプローチ",
      },
      {
        id: "pattern_c",
        name: "パターンC",
        successRate: 72,
        usageCount: 80,
        description: "保守的提案アプローチ",
      },
    ];

    const customerCondition = {
      industry: "IT",
      budgetScaleJPY: 10000000,
      decisionSpeedDays: 30,
    };

    const dealCondition = {
      customerId: "cust_12345",
      dealValue: 10000000,
      expectedCloseDateISO: "2026-09-01T00:00:00Z",
      stakeholderCount: 3,
    };

    const result = await generateRecommendation(
      mockAIEngine,
      customerCondition,
      dealCondition,
      recommendationPatternMaster
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(result.recommendedPattern).toBe("パターンA");
    expect(result.successRate).toBe(85);
    expect(result.usageCount).toBe(120);
    expect(result.source).toBe("internal_master");
    expect(result.reasoningExplanation).toBeDefined();
    expect(typeof result.reasoningExplanation).toBe("string");
    expect(result.reasoningExplanation.length).toBeGreaterThan(0);
    expect(result.isAIGenerated).toBe(false);
  });
});