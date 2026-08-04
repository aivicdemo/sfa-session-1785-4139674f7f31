import { visualizeRecommendationReasons } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1159: マッチスコアが0のパターンを可視化対象から除外する", () => {
    // Arrange: AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((patternId: string) => {
        if (patternId === "pattern_zero_score") {
          return { score: 0, confidence: 0 };
        } else if (patternId === "pattern_score_85") {
          return { score: 85, confidence: 0.92 };
        } else if (patternId === "pattern_score_72") {
          return { score: 72, confidence: 0.88 };
        }
        return { score: 0, confidence: 0 };
      }),
    };

    // 推奨内容のレスポンスデータ（マッチスコア0を含む）
    const recommendationResponse = {
      patterns: [
        {
          patternId: "pattern_zero_score",
          name: "Zero Score Pattern",
          description: "Pattern with zero match score",
          relevanceScore: 0,
        },
        {
          patternId: "pattern_score_85",
          name: "High Match Pattern",
          description: "Pattern with 85 match score",
          relevanceScore: 85,
        },
        {
          patternId: "pattern_score_72",
          name: "Medium Match Pattern",
          description: "Pattern with 72 match score",
          relevanceScore: 72,
        },
      ],
      customerId: "customer_001",
      dealCondition: "enterprise_software",
      timestamp: "2024-06-15T09:30:00Z",
    };

    // Act: 可視化対象のフィルタリング処理を実行
    const visualizationResult = visualizeRecommendationReasons(
      recommendationResponse,
      mockAIEngine
    );

    // Assert: マッチスコアが0のパターンが完全に除外されていることを確認
    expect(visualizationResult.visiblePatterns.length).toBe(2);
    expect(
      visualizationResult.visiblePatterns.some(
        (p: { patternId: string }) => p.patternId === "pattern_zero_score"
      )
    ).toBe(false);

    // スコア0以外のパターンのみが可視化対象として存在することを確認
    expect(
      visualizationResult.visiblePatterns.map(
        (p: { patternId: string; relevanceScore: number }) => ({
          id: p.patternId,
          score: p.relevanceScore,
        })
      )
    ).toEqual(
      expect.arrayContaining([
        { id: "pattern_score_85", score: 85 },
        { id: "pattern_score_72", score: 72 },
      ])
    );

    // 可視化画面に出力される推奨根拠の一覧にスコア0のパターンが表示されていないことを確認
    expect(
      visualizationResult.displayedReasons.every(
        (reason: { matchScore: number }) => reason.matchScore > 0
      )
    ).toBe(true);

    // 各表示パターンが正しいマッチスコアを保持していることを確認
    expect(visualizationResult.displayedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          patternId: "pattern_score_85",
          matchScore: 85,
          displayName: "High Match Pattern",
        }),
        expect.objectContaining({
          patternId: "pattern_score_72",
          matchScore: 72,
          displayName: "Medium Match Pattern",
        }),
      ])
    );
  });
});