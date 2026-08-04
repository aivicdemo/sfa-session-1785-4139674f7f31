import { displayRecommendationWithReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2739: 推奨根拠レコード作成失敗時、推奨内容表示がエラーになる", async () => {
    // Arrange
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec_20240115_001",
        customerId: "cust_12345",
        dealId: "deal_67890",
        proposalApproach: "提案戦略A：顧客の経営課題に基づくソリューション提案",
        confidenceScore: 85,
        generatedAt: new Date("2024-01-15T11:00:00Z"),
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockDatabaseAdapter = {
      insertRecommendationReasoning: jest
        .fn()
        .mockRejectedValue(new Error("推奨根拠レコード作成に失敗しました")),
      queryRecommendation: jest.fn(),
    };

    const input = {
      customerId: "cust_12345",
      customerName: "株式会社テスト",
      industry: "製造業",
      scale: "中堅企業",
      dealId: "deal_67890",
      dealStage: "初期検討",
      challenges: ["コスト削減", "効率化"],
    };

    // Act & Assert
    const result = await displayRecommendationWithReasoning(
      input,
      mockAIEngine,
      mockDatabaseAdapter
    );

    expect(result).toEqual({
      success: false,
      errorMessage: "申し訳ございません。推奨内容の表示処理に問題が発生しました",
      errorCode: "RECOMMENDATION_REASONING_CREATION_FAILED",
      recommendationData: null,
    });

    expect(mockDatabaseAdapter.insertRecommendationReasoning).toHaveBeenCalled();
  });
});