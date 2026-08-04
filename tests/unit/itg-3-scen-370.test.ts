import { generateImprovementSuggestions } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-370: 改善提案生成の入力となる目標精度が未指定のとき、エラーになる", async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerInfo = {
      customerId: "CUST-001",
      customerName: "株式会社サンプル",
      industry: "製造業",
      companySize: "中堅企業",
    };

    const dealConditions = {
      dealId: "DEAL-001",
      productCategory: "システム導入",
      estimatedValue: 5000000,
      proposalStage: "提案中",
    };

    const resultWithoutTargetAccuracy = await generateImprovementSuggestions(
      {
        customerInfo,
        dealConditions,
        targetAccuracy: undefined,
      },
      mockAIRecommendationEngine
    );

    expect(resultWithoutTargetAccuracy.statusCode).toBe(400);
    expect(resultWithoutTargetAccuracy.errorMessage).toMatch(/目標精度/);
    expect(resultWithoutTargetAccuracy.errorMessage).toContain(
      "targetAccuracy"
    );
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});