import { evaluateRecommendationScore } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2453: 推奨精度スコア算出機能 - 適合性判定スコアが1.0のときスコア計算に最大値として反映される", () => {
    // Arrange
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(1.0),
    };

    const dealConditionData = {
      customerIndustry: "manufacturing",
      customerChallenge: "supply_chain_optimization",
      budgetScale: 5000000,
      dealPhase: "negotiation",
      customerSize: "large",
      proposalContent: {
        title: "Supply Chain AI Solution",
        estimatedValue: 4500000,
        implementationPeriod: 90,
      },
    };

    // Act
    const recommendationScore = evaluateRecommendationScore(
      dealConditionData,
      mockAIEngine
    );

    // Assert
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealConditionData
    );
    expect(recommendationScore).toBe(1.0);
    expect(recommendationScore).toBeLessThanOrEqual(1.0);
    expect(recommendationScore).toBeGreaterThanOrEqual(0);
  });
});