import { evaluateRecommendationQuality } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-1487: 購買履歴データ品質判定機能 - AIRecommendationEngineへの再試行が最大3回に達するときエラーを返す", async () => {
    const aiEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    let callCount = 0;
    aiEngineStub.generateRecommendation.mockImplementation(() => {
      callCount++;
      const error = new Error("Request timeout");
      (error as any).code = "ETIMEDOUT";
      throw error;
    });

    const customerData = {
      customerId: "CUST-20240115-001",
      industryType: "manufacturing",
      employeeCount: 500,
      annualRevenue: 10000000,
    };

    const dealConditions = {
      dealId: "DEAL-20240115-001",
      productCategory: "industrial_equipment",
      budgetAmount: 500000,
      proposedTimeline: "Q1_2024",
    };

    const result = await evaluateRecommendationQuality(
      customerData,
      dealConditions,
      aiEngineStub
    );

    expect(callCount).toBe(4);
    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/推奨生成要求が失敗しました/);
    expect(result.error).toMatch(/最大再試行回数に到達しました/);
    expect(result).toHaveProperty("fallbackPattern");
    expect(result.fallbackPattern).toBeDefined();
    expect(typeof result.fallbackPattern.patternName).toBe("string");
    expect(typeof result.fallbackPattern.successRate).toBe("number");
    expect(result.fallbackPattern.successRate).toBeGreaterThanOrEqual(0);
    expect(result.fallbackPattern.successRate).toBeLessThanOrEqual(100);
  });
});