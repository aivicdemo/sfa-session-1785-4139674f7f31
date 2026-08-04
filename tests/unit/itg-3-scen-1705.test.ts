import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨妥当性スコア算出機能", () => {
  // SCEN-1705
  test("購買履歴0件の顧客に対して推奨スコアを0で計算する", () => {
    const customer = {
      customer_id: "TEST-ZERO-PURCHASE",
      purchase_history: [],
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = evaluatePatternRelevance(customer, mockAIEngine);

    expect(result).toBe(0);
    expect(typeof result).toBe("number");
    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});