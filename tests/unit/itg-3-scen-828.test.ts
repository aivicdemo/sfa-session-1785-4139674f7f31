import { calculateRecommendationConfidenceScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-828: 営業担当者IDがnullのとき、入力値検証エラーがthrowされる", () => {
    const invalidInput = {
      sales_rep_id: null,
      deal_id: "DEAL-001",
      customer_id: "CUST-001",
      recommendation_content: "提案アプローチ: 段階的導入",
      ai_engine: {
        generateRecommendation: jest.fn(),
        findSimilarPatterns: jest.fn(),
        explainRecommendationReasoning: jest.fn(),
        evaluatePatternRelevance: jest.fn(),
      },
    };

    expect(() =>
      calculateRecommendationConfidenceScore(invalidInput as any)
    ).toThrow(/営業担当者ID/);
  });
});