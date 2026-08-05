import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { generateHealthCheckReport } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-314
  test("[normal] システムヘルスチェック判定機能 - システム稼働状況・営業データ品質・AIエージェント推論精度の3項目すべてが合格でレポート生成される", () => {
    // Arrange: システムヘルスチェック判定機能の実行環境を初期化する
    const system_uptime_percentage = 99.5;
    const system_response_time_ms = 500;
    const data_completeness_percentage = 95.0;
    const data_error_rate_percentage = 1.0;
    const ai_inference_accuracy_score = 0.92;
    const report_timestamp = new Date("2024-01-15T10:30:00Z");

    // システム稼働状況チェックのスタブを『合格（稼働率99.5%以上、平均応答時間500ms以下）』に設定する
    const system_health_result = {
      status: "PASS",
      uptime_percentage: system_uptime_percentage,
      response_time_ms: system_response_time_ms,
    };

    // 営業データ品質チェックのスタブを『合格（完全性95%以上、妥当性エラー率1%以下）』に設定する
    const data_quality_result = {
      status: "PASS",
      completeness_percentage: data_completeness_percentage,
      error_rate_percentage: data_error_rate_percentage,
    };

    // AIエージェント推論精度チェックのスタブを『合格（精度スコア0.92、閾値0.85以上）』に設定する
    const ai_accuracy_result = {
      status: "PASS",
      accuracy_score: ai_inference_accuracy_score,
      threshold: 0.85,
    };

    // Act: ヘルスチェック判定処理を実行する
    const report = generateHealthCheckReport(
      system_health_result,
      data_quality_result,
      ai_accuracy_result,
      report_timestamp
    );

    // Assert: 生成されたレポートの内容と形式を検証する
    // (1) ヘルスチェック総合判定ステータスが『合格』
    expect(report.overall_status).toBe("PASS");

    // (2) システム稼働状況の判定が『合格』で稼働率99.5%と応答時間500msが記載
    expect(report.system_health.status).toBe("PASS");
    expect(report.system_health.uptime_percentage).toBe(99.5);
    expect(report.system_health.response_time_ms).toBe(500);

    // (3) 営業データ品質の判定が『合格』で完全性95%とエラー率1%が記載
    expect(report.data_quality.status).toBe("PASS");
    expect(report.data_quality.completeness_percentage).toBe(95.0);
    expect(report.data_quality.error_rate_percentage).toBe(1.0);

    // (4) AIエージェント推論精度の判定が『合格』で精度スコア0.92が記載
    expect(report.ai_accuracy.status).toBe("PASS");
    expect(report.ai_accuracy.accuracy_score).toBe(0.92);

    // (5) レポート生成タイムスタンプが現在時刻で記録されていること
    expect(report.generated_at).toEqual(new Date("2024-01-15T10:30:00Z"));
  });
});