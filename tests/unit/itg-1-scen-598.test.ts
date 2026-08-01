import { describe, test, expect, beforeEach } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { judgeDetectionImportance } from "../../src/logic/it-1-br-2-1-1-1";

fetchMock.enableMocks();

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-598
  test("問題検出結果の重要度・対応必要性判定機能 - 営業成約実績との相関度が高い検出結果は高い重要度に判定される", async () => {
    // テストデータ: 過去12ヶ月間の成約案件100件を想定
    const detection_results = [
      {
        detection_id: "DET_001",
        detection_type: "proposal_not_submitted",
        correlation_score: 75,
      },
      {
        detection_id: "DET_002",
        detection_type: "30day_no_followup",
        correlation_score: 72,
      },
      {
        detection_id: "DET_003",
        detection_type: "low_contact_frequency",
        correlation_score: 70,
      },
      {
        detection_id: "DET_004",
        detection_type: "weak_proposal_content",
        correlation_score: 65,
      },
      {
        detection_id: "DET_005",
        detection_type: "missing_customer_needs",
        correlation_score: 58,
      },
      {
        detection_id: "DET_006",
        detection_type: "improper_timing",
        correlation_score: 52,
      },
      {
        detection_id: "DET_007",
        detection_type: "unclear_next_step",
        correlation_score: 55,
      },
      {
        detection_id: "DET_008",
        detection_type: "generic_proposal",
        correlation_score: 48,
      },
      {
        detection_id: "DET_009",
        detection_type: "delayed_response",
        correlation_score: 35,
      },
      {
        detection_id: "DET_010",
        detection_type: "insufficient_preparation",
        correlation_score: 22,
      },
    ];

    // スタブAPI: 相関度スコアを返却（既に上記で設定）
    fetchMock.mockResponseOnce(
      JSON.stringify({
        correlation_analysis_completed: true,
        total_detected_issues: 10,
        high_correlation_count: 3,
        medium_correlation_count: 4,
        low_correlation_count: 3,
      }),
      { status: 200 }
    );

    // 重要度判定ロジックを実行
    const importance_judgment_result = await judgeDetectionImportance(
      detection_results
    );

    // 期待結果の検証
    // 相関度スコア70以上 → 重要度『高』
    const high_importance = importance_judgment_result.filter(
      (result: any) => result.importance_level === "high"
    );
    expect(high_importance.length).toBe(3);
    expect(high_importance.map((r: any) => r.detection_id).sort()).toEqual([
      "DET_001",
      "DET_002",
      "DET_003",
    ]);

    // 相関度スコア50～69 → 重要度『中』
    const medium_importance = importance_judgment_result.filter(
      (result: any) => result.importance_level === "medium"
    );
    expect(medium_importance.length).toBe(4);
    expect(medium_importance.map((r: any) => r.detection_id).sort()).toEqual([
      "DET_004",
      "DET_005",
      "DET_006",
      "DET_007",
    ]);

    // 相関度スコア50未満 → 重要度『低』
    const low_importance = importance_judgment_result.filter(
      (result: any) => result.importance_level === "low"
    );
    expect(low_importance.length).toBe(3);
    expect(low_importance.map((r: any) => r.detection_id).sort()).toEqual([
      "DET_008",
      "DET_009",
      "DET_010",
    ]);

    // 全件の重要度が正しく判定されていることを確認
    expect(importance_judgment_result.length).toBe(10);
    importance_judgment_result.forEach((result: any) => {
      expect(["high", "medium", "low"]).toContain(result.importance_level);
      expect(typeof result.correlation_score).toBe("number");
      expect(result.correlation_score).toBeGreaterThanOrEqual(0);
      expect(result.correlation_score).toBeLessThanOrEqual(100);
    });
  });
});