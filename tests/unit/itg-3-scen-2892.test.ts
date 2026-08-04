import { evaluateRecommendationFieldApplicability } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2892
  test("推奨内容の営業現場適合性判定 - 標準プロセスとの乖離度が許容閾値未満のときに適合性が高と判定される", () => {
    // Arrange
    const deviationScore = 0.15;
    const deviationThreshold = 0.3;
    const expectedConfidenceScore = 0.85;

    const newDealData = {
      customerIndustry: "製造業",
      dealStage: "初期接触",
      budgetScale: 50000000,
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        deviationScore: deviationScore,
        deviationThreshold: deviationThreshold,
      }),
    };

    // Act
    const result = evaluateRecommendationFieldApplicability(
      newDealData,
      mockAIRecommendationEngine
    );

    // Assert
    expect(result.applicabilityLevel).toBe("HIGH");
    expect(result.confidenceScore).toBe(expectedConfidenceScore);
    expect(result.metadata).toEqual({
      applicabilityInField: "営業現場での適用可能性が高い",
    });
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newDealData
    );
  });
});