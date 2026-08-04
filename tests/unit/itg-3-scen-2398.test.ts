import { describe, test, expect } from "@jest/globals";
import { evaluateRecommendationPrecision } from "../../src/logic/it-1-br-3-3-2-1";

describe("推論精度スコア算出機能", () => {
  // SCEN-2398
  test("成功パターン抽出データが空配列のとき、エラーが発生する", () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerId: "CUST-2024-001",
      customerIndustry: "IT",
      customerScale: "large",
      dealAmount: 5000000,
      dealStage: "proposal",
      dealConditions: {
        budgetLimit: 10000000,
        implementationSchedule: "3months",
        decisionMaker: "CTO",
      },
    };

    expect(() =>
      evaluateRecommendationPrecision(newDealData, mockAIRecommendationEngine)
    ).toThrow(/成功パターン/);
  });
});