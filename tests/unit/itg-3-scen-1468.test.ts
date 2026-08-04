import { evaluateRecommendationQualityFromPurchaseHistory } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1468
  test("購買履歴データ品質判定機能 - 提案内容が空のときエラーを返す", () => {
    const customerId = "CUST-20240115-001";
    const dealConditions = {
      industryType: "製造業",
      companySize: "中堅企業",
      estimatedBudget: 5000000,
      decisionTimeframe: 90,
    };
    const purchaseHistory = [
      {
        purchaseDate: "2023-12-01",
        productCategory: "システム導入",
        amount: 2000000,
        result: "成功",
      },
      {
        purchaseDate: "2023-09-15",
        productCategory: "保守サービス",
        amount: 500000,
        result: "成功",
      },
    ];

    const aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalContent: "",
        confidenceScore: 0,
        reasoningBasis: [],
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(async () => {
      await evaluateRecommendationQualityFromPurchaseHistory(
        customerId,
        dealConditions,
        purchaseHistory,
        aiEngineStub
      );
    }).toThrow(/提案内容/);
  });
});