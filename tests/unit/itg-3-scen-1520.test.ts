import { evaluatePurchaseHistoryQuality } from "../../src/logic/it-1-br-3-3-2-1";

describe("購買履歴データ品質判定機能", () => {
  test("SCEN-1520: 購買金額が業務上の最大規模値のとき品質判定が正常に実行される", () => {
    // Setup: AIRecommendationEngine スタブ
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.95,
        isApplicable: true,
        applicablePatterns: [
          {
            patternId: "PAT_LARGE_EQUIPMENT_001",
            patternName: "大型設備購買パターン",
            matchScore: 0.92,
          },
        ],
      }),
    };

    // Test data: 購買金額が最大規模値（1億円）
    const purchase_history_input = {
      purchase_amount: 100_000_000,
      customer_id: "TEST_MAX_001",
      purchase_datetime: new Date("2026-01-15T10:30:00Z"),
      product_category: "大型設備",
    };

    const before_execution_timestamp = new Date("2026-01-15T10:30:05Z");
    const after_execution_timestamp = new Date("2026-01-15T10:30:15Z");

    // Execute: 品質判定機能の実行
    const quality_judgment_result = evaluatePurchaseHistoryQuality(
      purchase_history_input,
      mockAIEngine
    );

    // Verify: ステータスコード検証
    expect(quality_judgment_result.status_code).toBe(200);

    // Verify: 判定ステータス検証
    expect(quality_judgment_result.judgment_status).toBe("VALID");

    // Verify: データ完全性スコア検証（≧0.95）
    expect(quality_judgment_result.data_completeness_score).toBeGreaterThanOrEqual(0.95);

    // Verify: 異常フラグ検証
    expect(quality_judgment_result.anomaly_flag).toBe(false);

    // Verify: 判定時刻がシステム現在時刻±5秒以内
    const judgment_timestamp = new Date(quality_judgment_result.judgment_timestamp);
    expect(judgment_timestamp.getTime()).toBeGreaterThanOrEqual(
      before_execution_timestamp.getTime()
    );
    expect(judgment_timestamp.getTime()).toBeLessThanOrEqual(
      after_execution_timestamp.getTime()
    );

    // Verify: AIエンジン呼び出しが1回実行されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);

    // Verify: AIエンジン呼び出しの引数検証
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith({
      purchase_amount: 100_000_000,
      customer_id: "TEST_MAX_001",
      purchase_datetime: new Date("2026-01-15T10:30:00Z"),
      product_category: "大型設備",
    });

    // Verify: メタデータの存在確認
    expect(quality_judgment_result).toHaveProperty("judgment_timestamp");
    expect(quality_judgment_result).toHaveProperty("data_completeness_score");
    expect(quality_judgment_result).toHaveProperty("anomaly_flag");

    // Verify: 適用可能パターン情報が含まれていること
    expect(quality_judgment_result.applicable_patterns).toBeDefined();
    expect(Array.isArray(quality_judgment_result.applicable_patterns)).toBe(true);
    expect(quality_judgment_result.applicable_patterns.length).toBeGreaterThan(0);
  });
});