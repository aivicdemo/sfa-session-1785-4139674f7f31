import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ適用可能性判定機能", () => {
  test("SCEN-2245: 適用可能性スコアが0.0（不適用）と判定される", () => {
    // Arrange
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.0),
    };

    const dealCondition = {
      customerIndustry: "製造業",
      dealSize: "小規模",
      budget: "500万円未満",
      implementationPeriod: "6ヶ月以内",
    };

    const expectedResult = {
      applicabilityScore: 0.0,
      status: "INAPPLICABLE",
      recommendedApproach: null,
      reasoning:
        "入力された商談条件に該当する過去の成功パターンが存在しません。営業担当者の経験に基づく提案をお勧めします。",
      displayMessage:
        "この案件には、学習済みの提案パターンが適用できません",
    };

    // Act
    const result = evaluatePatternRelevance(dealCondition, mockAIEngine);

    // Assert
    expect(result).toEqual(expectedResult);
    expect(result.applicabilityScore).toBe(0.0);
    expect(result.status).toBe("INAPPLICABLE");
    expect(result.recommendedApproach).toBeNull();
    expect(result.reasoning).toBe(
      "入力された商談条件に該当する過去の成功パターンが存在しません。営業担当者の経験に基づく提案をお勧めします。"
    );
    expect(result.displayMessage).toBe(
      "この案件には、学習済みの提案パターンが適用できません"
    );
  });
});