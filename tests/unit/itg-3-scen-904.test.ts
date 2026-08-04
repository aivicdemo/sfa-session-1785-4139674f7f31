import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン照合機能", () => {
  test("SCEN-904: 適用可能性スコアが閾値0直上で照合結果の適用判定がなされる", () => {
    // Arrange
    const successPattern = {
      patternId: "pattern_001",
      customerIndustry: "製造業",
      customerSize: "large",
      dealAmount: 5000000,
      dealPhase: "proposal",
      successCriteria: {
        adoptionRate: 0.75,
        timeToClose: 45,
        avgContractValue: 4500000,
      },
    };

    const newDealCondition = {
      customerIndustry: "製造業",
      customerSize: "large",
      dealAmount: 5200000,
      dealPhase: "proposal",
      customerHistory: {
        previousDeals: 2,
        totalContractValue: 8000000,
      },
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.5),
    };

    // Act
    const result = evaluatePatternRelevance(
      successPattern,
      newDealCondition,
      mockAIEngine
    );

    // Assert
    expect(result.isApplicable).toBe(true);
    expect(result.patternId).toBe("pattern_001");
    expect(result.relevanceScore).toBe(0.5);
    expect(result.matchedPatternDetails).toBeDefined();
    expect(result.matchedPatternDetails.customerIndustry).toBe("製造業");
    expect(result.matchedPatternDetails.customerSize).toBe("large");
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      successPattern,
      newDealCondition
    );
  });
});