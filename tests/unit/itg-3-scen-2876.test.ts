import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨内容検証判定機能", () => {
  // SCEN-2876
  test("成功パターン抽出の信頼度スコアが負の値のとき、エラーを返す", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        confidenceScore: -0.5,
        isRelevant: false,
        reasoning: "Score below threshold"
      })
    };

    const newDealData = {
      customerId: "CUST-001",
      customerIndustry: "IT",
      customerSize: "enterprise",
      dealAmount: 5000000,
      dealStage: "proposal",
      productCategory: "cloud_services",
      dealDuration: 90,
      historicalSuccessRate: 0.75
    };

    const result = evaluatePatternRelevance(newDealData, mockAIRecommendationEngine);

    expect(result).toHaveProperty("errorCode", "INVALID_PATTERN_SCORE");
    expect(result).toHaveProperty("httpStatusCode", 400);
    expect(result.errorMessage).toMatch(/信頼度スコアが無効です/);
    expect(result.errorMessage).toMatch(/0以上1以下/);
    expect(result.errorMessage).toMatch(/-0\.5/);
  });
});