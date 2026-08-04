import { generateRecommendationWithFallback } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨内容キャッシュ保有機能", () => {
  test("SCEN-1163: AIエンジン失敗時、過去推奨履歴1件がキャッシュから代替表示候補として保有される", () => {
    // Arrange: キャッシュストレージの初期化と過去推奨履歴1件を事前登録
    const cachedRecommendation = {
      recommendationId: "REC-001",
      customerIndustry: "製造業",
      proposalApproach: "コスト削減型",
      generatedAt: new Date("2026-01-15T10:30:00Z"),
    };

    const mockCacheStorage = {
      getCachedRecommendations: jest.fn().mockReturnValue([cachedRecommendation]),
    };

    // AIRecommendationEngineのスタブを失敗状態に設定
    const failingAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error("API call timeout")
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 新規案件データの入力
    const newDealInput = {
      customerIndustry: "製造業",
      dealStage: "初期接触",
      customerScale: "中堅企業",
    };

    // Act: 推奨生成機能を実行
    const result = generateRecommendationWithFallback(
      newDealInput,
      failingAIEngine,
      mockCacheStorage
    );

    // Assert: キャッシュストレージのgetCachedRecommendations()が呼び出されたか確認
    expect(mockCacheStorage.getCachedRecommendations).toHaveBeenCalled();

    // キャッシュから取得されたデータが代替表示候補として保有されていることを確認
    expect(result.fallbackRecommendations).toBeDefined();
    expect(result.fallbackRecommendations.length).toBe(1);

    // 代替表示候補のメタデータがすべて正確に保持されていることを確認
    const fallbackCandidate = result.fallbackRecommendations[0];
    expect(fallbackCandidate.recommendationId).toBe("REC-001");
    expect(fallbackCandidate.customerIndustry).toBe("製造業");
    expect(fallbackCandidate.proposalApproach).toBe("コスト削減型");
    expect(fallbackCandidate.generatedAt).toEqual(
      new Date("2026-01-15T10:30:00Z")
    );

    // AIエンジンの失敗が記録されていることを確認
    expect(result.isAIEngineFailed).toBe(true);
    expect(result.fallbackApplied).toBe(true);
  });
});