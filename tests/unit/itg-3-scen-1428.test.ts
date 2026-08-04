import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と提案アプローチ推奨機能", () => {
  // SCEN-1428
  test("AI推奨エンジン失敗時、内部推奨パターンマスタから統計的上位パターンが返却される", async () => {
    // 推奨パターンマスタ テストデータ
    const mockRecommendationPatterns = [
      {
        pattern_id: "PATTERN_A",
        success_rate: 85,
        application_count: 120,
        source: "internal_master_fallback"
      },
      {
        pattern_id: "PATTERN_B",
        success_rate: 72,
        application_count: 95,
        source: "internal_master_fallback"
      },
      {
        pattern_id: "PATTERN_C",
        success_rate: 68,
        application_count: 60,
        source: "internal_master_fallback"
      }
    ];

    // AIRecommendationEngine 失敗をシミュレート
    const mockAIEngine = {
      generateRecommendation: jest.fn()
        .mockRejectedValueOnce(new Error("API timeout"))
        .mockRejectedValueOnce(new Error("API timeout"))
        .mockRejectedValueOnce(new Error("API timeout"))
    };

    // 内部推奨パターンマスタ取得をシミュレート
    const mockInternalPatternMaster = {
      getTopPatternsBySuccessRate: jest.fn()
        .mockResolvedValueOnce(mockRecommendationPatterns[0])
    };

    // 新規案件データ
    const newDealData = {
      customer_industry: "retail",
      budget_scale: 5000000,
      decision_makers_count: 3
    };

    // 推奨生成を呼び出す
    const result = await generateRecommendation(
      newDealData,
      mockAIEngine,
      mockInternalPatternMaster
    );

    // 期待結果の検証
    expect(result.pattern_id).toBe("PATTERN_A");
    expect(result.success_rate).toBe(85);
    expect(result.application_count).toBe(120);
    expect(result.source).toBe("internal_master_fallback");
    expect(result.brief_explanation).toBeDefined();
    expect(result.brief_explanation.length).toBeLessThanOrEqual(200);
    expect(result.user_message).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );

    // AIエンジンが3回呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // 内部推奨パターンマスタが呼び出されたことを確認
    expect(mockInternalPatternMaster.getTopPatternsBySuccessRate).toHaveBeenCalled();
  });
});