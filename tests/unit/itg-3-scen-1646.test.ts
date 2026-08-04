import { calculateRecommendationScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1646
  test("推奨スコア算出機能 - 顧客の購買履歴データが空配列のとき、エラーが発生する", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      customerId: "CUST-001",
      purchaseHistory: [],
      proposalContent: {
        productId: "PROD-A",
        category: "Software",
        amount: 500000,
      },
      aiEngine: mockAIEngine,
    };

    expect(() => calculateRecommendationScore(input)).toThrow(
      /購買履歴/
    );
  });
});