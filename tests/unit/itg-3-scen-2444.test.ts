import { calculateRecommendationConfidenceScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠可視化 - 推奨精度スコア算出機能", () => {
  test("SCEN-2444: 信頼度スコア101の異常値入力時に入力値検証エラーをスロー", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(101),
    };

    const dealCondition = {
      customerIndustry: "IT",
      customerScale: "large",
      productCategory: "cloud_services",
      dealAmount: 5000000,
      dealStage: "proposal",
      confidenceScore: 101,
    };

    expect(() =>
      calculateRecommendationConfidenceScore(
        dealCondition,
        mockAIRecommendationEngine
      )
    ).toThrow(/信頼度スコアは0～100の範囲内である必要があります/);
  });
});