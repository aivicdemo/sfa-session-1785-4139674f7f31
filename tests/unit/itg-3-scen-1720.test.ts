import { evaluateRecommendationScore } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨妥当性スコア算出機能", () => {
  test("SCEN-1720: 顧客IDが欠落しているとき推奨スコア算出が失敗する", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    const inputWithNullCustomerId = {
      customerId: null,
      dealConditions: {
        industry: "IT",
        companySize: "large",
        budget: 5000000,
      },
      successPattern: {
        patternId: "pattern-001",
        matchScore: 0.85,
      },
      aiEngine: mockAIRecommendationEngine,
    };

    expect(() =>
      evaluateRecommendationScore(inputWithNullCustomerId)
    ).toThrow(/顧客ID/);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});