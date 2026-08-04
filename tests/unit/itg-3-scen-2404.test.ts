import { jest } from "@jest/globals";
import { evaluateRecommendationAccuracy } from "../../src/logic/it-1-br-3-3-2-1";

describe("推論精度スコア算出機能 - AIエージェント外部連携失敗時の代替パターン適用", () => {
  test("SCEN-2404: AIRecommendationEngineの3回再試行後も失敗したとき、内部推奨パターンマスタから統計的に上位パターンを使用してスコアが算出される", async () => {
    // ===== Setup: AIRecommendationEngineをスタブ化 =====
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    // 3回すべてで失敗するよう設定
    mockAIEngine.generateRecommendation.mockRejectedValue(
      new Error("API timeout")
    );

    // ===== Setup: 内部推奨パターンマスタの準備 =====
    const internalPatternMaster = [
      {
        pattern_id: "PAT-20240401",
        pattern_name: "大規模顧客向けクラウド導入",
        past_success_count: 100,
        success_rate: 0.85,
        applicability_frequency: 45,
      },
      {
        pattern_id: "PAT-20240102",
        pattern_name: "中堅企業向けコスト最適化",
        past_success_count: 75,
        success_rate: 0.78,
        applicability_frequency: 32,
      },
      {
        pattern_id: "PAT-20231215",
        pattern_name: "スタートアップ向けスケーラビリティ",
        past_success_count: 45,
        success_rate: 0.72,
        applicability_frequency: 18,
      },
    ];

    // ===== Setup: テスト用新規案件データ =====
    const new_deal_data = {
      customer_id: "CUST-00123456",
      customer_industry: "manufacturing",
      customer_company_size: "large_enterprise",
      deal_amount: 5000000,
      deal_stage: "initial_contact",
      required_timeline_days: 60,
      customer_challenges: ["cost_reduction", "digital_transformation"],
    };

    // ===== Execute: スコア算出処理を実行 =====
    const result = await evaluateRecommendationAccuracy(
      new_deal_data,
      mockAIEngine,
      internalPatternMaster
    );

    // ===== Verify: AIRecommendationEngineが最大3回試行されたことを確認 =====
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // ===== Verify: 統計的に上位のパターン（成功件数・成約率が最も高い）が選定されていることを確認 =====
    expect(result.selected_pattern_id).toBe("PAT-20240401");
    expect(result.selected_pattern_name).toBe("大規模顧客向けクラウド導入");

    // ===== Verify: 推論精度スコアが0.0～1.0の範囲で数値化されていることを確認 =====
    expect(result.accuracy_score).toBeGreaterThanOrEqual(0.0);
    expect(result.accuracy_score).toBeLessThanOrEqual(1.0);
    // 期待スコア値：成約率85%ベース → 0.85
    expect(result.accuracy_score).toBe(0.85);

    // ===== Verify: 根拠説明が簡略版フォーマットであることを確認 =====
    expect(result.reasoning_summary).toMatch(/PAT-20240401/);
    expect(result.reasoning_summary).toMatch(/成功件数/);
    expect(result.reasoning_summary).toMatch(/100/);
    expect(result.reasoning_summary).toMatch(/成約率/);
    expect(result.reasoning_summary).toMatch(/85/);
    // 詳細な生成AI由来の自然言語説明は含まれないことを確認
    expect(result.reasoning_summary).not.toMatch(/しかし|したがって|一方|ただし/);

    // ===== Verify: 結果オブジェクトが期待されたフォーマットであることを確認 =====
    expect(result).toHaveProperty("selected_pattern_id");
    expect(result).toHaveProperty("selected_pattern_name");
    expect(result).toHaveProperty("accuracy_score");
    expect(result).toHaveProperty("reasoning_summary");
    expect(result).toHaveProperty("pattern_statistics");

    // ===== Verify: パターンの統計情報が正確に格納されていることを確認 =====
    expect(result.pattern_statistics).toEqual({
      past_success_count: 100,
      success_rate: 0.85,
      applicability_frequency: 45,
    });

    // ===== Verify: フォールバック使用フラグが設定されていることを確認 =====
    expect(result.fallback_used).toBe(true);
  });
});