import { decideSalesCoachingPolicy } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 営業担当者への指導方針決定", () => {
  test("SCEN-499: 営業担当者IDが空文字列のとき、バリデーションエラーが発生する", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const validCustomerInfo = {
      customerId: "CUST-001",
      customerName: "テスト顧客",
      industry: "IT",
      scale: "large",
    };

    const validDealCondition = {
      dealId: "DEAL-001",
      dealStage: "negotiation",
      estimatedAmount: 5000000,
      closingDate: "2024-12-31",
    };

    const invalidSalesPersonId = "";

    expect(() =>
      decideSalesCoachingPolicy(
        invalidSalesPersonId,
        validCustomerInfo,
        validDealCondition,
        mockAIEngine
      )
    ).toThrow(/営業担当者ID/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});