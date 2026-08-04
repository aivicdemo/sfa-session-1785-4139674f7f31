import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨妥当性スコア算出機能", () => {
  test("SCEN-1732: 信頼度スコアが100のとき推奨スコアを計算する", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(100),
    };

    const input = {
      dealCondition: {
        customerId: "CUST-001",
        industryType: "manufacturing",
        companySize: "large",
        dealAmount: 5000000,
        dealStage: "proposal",
      },
      successPattern: {
        patternId: "PATTERN-001",
        matchingScore: 0.95,
        applicabilityConditions: {
          industryType: "manufacturing",
          companySizeRange: { min: "large", max: "large" },
          dealAmountRange: { min: 1000000, max: 10000000 },
        },
      },
      aiEngine: mockAIRecommendationEngine,
    };

    const result = evaluatePatternRelevance(input);

    expect(result).toBe(100);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        dealCondition: input.dealCondition,
        successPattern: input.successPattern,
      })
    );
  });
});