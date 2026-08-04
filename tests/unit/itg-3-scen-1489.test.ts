import { evaluatePurchaseHistoryDataQuality } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1489: 購買履歴データ品質判定機能 - 同じ入力データで2回実行しても同じ品質スコアを返す", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85),
    };

    const testPurchaseHistoryData = {
      customerId: "CUST-20240115-001",
      productCategory: "IT機器",
      purchaseDate: "2024-01-15T10:30:00Z",
      amount: 250000,
      quantity: 5,
      vendor: "Tech Supplier Inc",
    };

    const firstExecutionResult = evaluatePurchaseHistoryDataQuality(
      testPurchaseHistoryData,
      mockAIRecommendationEngine
    );

    const secondExecutionResult = evaluatePurchaseHistoryDataQuality(
      testPurchaseHistoryData,
      mockAIRecommendationEngine
    );

    expect(firstExecutionResult.qualityScore).toBe(85);
    expect(secondExecutionResult.qualityScore).toBe(85);
    expect(firstExecutionResult.qualityScore).toBe(secondExecutionResult.qualityScore);
    expect(firstExecutionResult.category).toBe(secondExecutionResult.category);
    expect(firstExecutionResult.category).toBe("high_quality");
  });
});