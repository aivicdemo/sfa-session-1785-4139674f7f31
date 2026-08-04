import { describe, test, expect, beforeEach } from "@jest/globals";
import { decideGuidancePolicy } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 営業担当者への指導方針決定", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-499
  test("営業担当者IDが空文字列のとき、バリデーションエラーが発生する", () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const guidanceInput = {
      salesPersonId: "",
      customerInfo: {
        customerId: "CUST-001",
        industry: "製造業",
        revenue: 50000000,
      },
      dealConditions: {
        dealId: "DEAL-001",
        productCategory: "システム導入",
        dealStage: "提案中",
        dealAmount: 5000000,
      },
      dataQualityScore: 95,
      improvementPriority: "高",
      improvementTargetItems: ["顧客名表記", "業種分類"],
    };

    expect(() =>
      decideGuidancePolicy(guidanceInput, mockRecommendationEngine)
    ).toThrow(/営業担当者ID/);

    expect(
      mockRecommendationEngine.generateRecommendation
    ).not.toHaveBeenCalled();
  });
});