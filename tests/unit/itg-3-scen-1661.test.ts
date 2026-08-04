import { describe, test, expect } from "@jest/globals";
import { calculateRecommendationScore } from "../../src/logic/it-1-br-3-1-1-1";

const mockAIRecommendationEngine = {
  generateRecommendation: jest.fn(),
  findSimilarPatterns: jest.fn(),
  explainRecommendationReasoning: jest.fn(),
  evaluatePatternRelevance: jest.fn(),
};

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1661: [error] 推奨スコア算出機能 - 顧客の制約条件(購入金額上限)に抵触する提案のとき、エラーが発生する", () => {
    const customerData = {
      customerId: "CUST-001",
      budgetLimit: 500000,
      name: "Test Customer Inc",
      industry: "IT",
    };

    const dealCondition = {
      dealId: "DEAL-001",
      proposalTotalAmount: 600000,
      productList: [
        {
          productId: "PROD-A",
          price: 350000,
        },
        {
          productId: "PROD-B",
          price: 250000,
        },
      ],
    };

    const mockRecommendation = {
      recommendationId: "REC-001",
      proposedApproach: "Proposal approach for customer",
      totalAmount: 600000,
      confidenceScore: 85,
      successPatternId: "PATTERN-001",
    };

    mockAIRecommendationEngine.generateRecommendation.mockReturnValue(
      mockRecommendation
    );

    expect(() => {
      calculateRecommendationScore(customerData, dealCondition, mockAIRecommendationEngine);
    }).toThrow(/購入金額上限/);

    expect(() => {
      calculateRecommendationScore(customerData, dealCondition, mockAIRecommendationEngine);
    }).toThrow(/500,000円/);

    expect(() => {
      calculateRecommendationScore(customerData, dealCondition, mockAIRecommendationEngine);
    }).toThrow(/600,000円/);
  });
});