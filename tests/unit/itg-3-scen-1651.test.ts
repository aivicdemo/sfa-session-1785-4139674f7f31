import { calculateRecommendationScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1651
  test("推奨数量が負の値のとき、エラーが発生する", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedQuantity: -5,
        confidence: 85,
        successPattern: "pattern_001",
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      customerId: "CUST_001",
      productId: "PROD_002",
      customerHistoryData: {
        purchaseHistory: [
          { quantity: 10, date: "2024-01-15" },
          { quantity: 15, date: "2024-02-20" },
        ],
        lastPurchaseAmount: 15000,
        purchaseFrequencyDays: 30,
      },
      proposalContent: {
        productName: "Enterprise Solution",
        price: 500000,
        implementationPeriod: 90,
      },
      recommendedQuantity: -5,
      confidence: 85,
      successPatternId: "pattern_001",
    };

    expect(() =>
      calculateRecommendationScore(input, mockAIEngine)
    ).toThrow(/INVALID_QUANTITY|推奨数量/);
  });
});