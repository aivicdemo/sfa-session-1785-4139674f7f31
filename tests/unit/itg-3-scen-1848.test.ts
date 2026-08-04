import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1848
  test("推奨数量が0のとき根拠情報の生成に失敗する", async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const mockPatternMaster = [
      {
        patternId: "pattern_001",
        successRate: 85,
        description: "顧客規模中堅、BtoBサービス導入パターン",
        timingReasoning: "前年同時期の購買実績から3ヶ月後が最適",
        quantityReasoning: "競合他社導入状況から判断した市場シェア",
      },
      {
        patternId: "pattern_002",
        successRate: 78,
        description: "顧客規模大企業、システム更新パターン",
        timingReasoning: "会計年度末の予算執行時期に合致",
        quantityReasoning: "部門数と利用者数から逆算した必要量",
      },
    ];

    mockAIEngine.explainRecommendationReasoning.mockRejectedValueOnce(
      new Error("推奨数量0では根拠説明を生成できません")
    );

    const recommendationData = {
      dealId: "deal_test_001",
      customerId: "customer_abc",
      recommendedQuantity: 0,
      recommendedTiming: "2026-02-15T09:00:00Z",
      dealStage: "proposal",
      customerIndustry: "manufacturing",
      customerSize: "mid-market",
    };

    const result = await explainRecommendationReasoning(
      recommendationData,
      mockAIEngine,
      mockPatternMaster
    );

    expect(result.status).toBe("fallback");
    expect(result.userMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );
    expect(result.cachedRecommendation).toBeDefined();
    expect(result.cachedRecommendation.patternId).toBe("pattern_001");
    expect(result.cachedRecommendation.successRate).toBe(85);
    expect(result.cachedRecommendation.timingReasoning).toBe(
      "前年同時期の購買実績から3ヶ月後が最適"
    );
    expect(result.cachedRecommendation.quantityReasoning).toBe(
      "競合他社導入状況から判断した市場シェア"
    );
    expect(result.retryAttempted).toBe(false);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: "deal_test_001",
        recommendedQuantity: 0,
      })
    );
  });
});