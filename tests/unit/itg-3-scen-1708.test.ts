import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨妥当性スコア算出機能", () => {
  // SCEN-1708
  test("提案内容が0件のとき推奨スコアを0で計算する", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposals: [],
        reasoning: "No proposals generated"
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const dealCondition = {
      customerId: "CUST-001",
      customerIndustry: "Manufacturing",
      dealStage: "Negotiation",
      dealAmount: 500000,
      proposalCount: 0,
      similarPatterns: []
    };

    const result = evaluatePatternRelevance(
      dealCondition,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(typeof result.recommendationScore).toBe("number");
    expect(result.recommendationScore).toBe(0);
    expect(result.isValid).toBe(true);
  });
});