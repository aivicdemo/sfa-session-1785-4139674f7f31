import { describe, test, expect, beforeEach } from "@jest/globals";
import { visualizeRecommendationBasis } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-966
  test("推奨根拠の類似度スコアが1.0を超過するとき、不正値エラーが返される", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(1.05),
    };

    const dealConditions = {
      customerIndustry: "製造業",
      budgetScale: "5000万円以上",
      purchaseStage: "導入検討",
      companySize: "大企業",
    };

    expect(() =>
      visualizeRecommendationBasis(dealConditions, mockAIRecommendationEngine)
    ).toThrow(/類似度スコア/);
  });
});