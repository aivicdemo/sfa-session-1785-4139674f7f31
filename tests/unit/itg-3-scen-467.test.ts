import { evaluateCoachingRecommendation } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 指導施策推奨機能", () => {
  // SCEN-467
  test("スコアが高水準（61～80点）の場合、「注意喚起」が推奨される", () => {
    // Arrange
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 72,
        isApplicable: true,
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        "顧客の業種と規模が過去の成功事例と一致度が高く、提案タイミングが最適です。" +
          "ただし、競合状況への対応が不明確なため、注意喚起が必要です。"
      ),
    };

    const dealInput = {
      customerId: "CUST-001",
      customerIndustry: "製造業",
      customerScale: "中堅企業",
      dealAmount: 5000000,
      dealStage: "提案段階",
      proposalContent: "生産効率化システム導入",
    };

    // Act
    const result = evaluateCoachingRecommendation(
      dealInput,
      mockAIRecommendationEngine
    );

    // Assert
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "CUST-001",
        customerIndustry: "製造業",
        customerScale: "中堅企業",
        dealAmount: 5000000,
        dealStage: "提案段階",
        proposalContent: "生産効率化システム導入",
      })
    );

    expect(result.recommendedCoachingType).toBe("注意喚起");
    expect(result.score).toBe(72);
    expect(result.message).toBe(
      "スコア61～80点：注意喚起が推奨されます"
    );
    expect(result.explanation).toContain("顧客の業種と規模が過去の成功事例と一致度が高く");
    expect(result.explanation).toContain("注意喚起が必要です");
  });
});