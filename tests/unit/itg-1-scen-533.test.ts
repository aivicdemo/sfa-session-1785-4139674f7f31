import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { monitorInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  test("SCEN-533: 推論精度がアラート設定の閾値を超える場合、アラートは生成されない", async () => {
    // Arrange: アラート設定の初期化
    const alert_threshold_percent = 80;
    const current_inference_accuracy_percent = 85;
    const monitoring_timestamp_iso = "2024-01-15T10:30:00Z";

    // Mock: 推論精度監視モジュールのレスポンス
    fetchMock.mockResponseOnce(
      JSON.stringify({
        accuracy_percent: current_inference_accuracy_percent,
        timestamp: monitoring_timestamp_iso,
      }),
      { status: 200 }
    );

    // Mock: アラート設定取得
    fetchMock.mockResponseOnce(
      JSON.stringify({
        threshold_percent: alert_threshold_percent,
        alert_enabled: true,
      }),
      { status: 200 }
    );

    // Mock: アラート生成エンドポイント（呼ばれないことを検証）
    fetchMock.mockResponseOnce(JSON.stringify({ created: false }), {
      status: 200,
    });

    // Mock: 監視ログ記録エンドポイント
    fetchMock.mockResponseOnce(
      JSON.stringify({
        log_id: "log_20240115_001",
        message: "精度閾値超過なし",
        recorded_at: monitoring_timestamp_iso,
      }),
      { status: 200 }
    );

    // Act: 推論精度の自動監視処理を実行
    const result = await monitorInferenceAccuracy({
      alert_threshold_percent,
      monitoring_timestamp_iso,
    });

    // Assert: 期待結果の検証
    expect(result.alert_generated).toBe(false);
    expect(result.alert_message).toBeUndefined();
    expect(result.current_accuracy_percent).toBe(
      current_inference_accuracy_percent
    );
    expect(result.threshold_percent).toBe(alert_threshold_percent);
    expect(result.monitoring_log_message).toBe("精度閾値超過なし");
    expect(result.exceeds_threshold).toBe(false);

    // Assert: フェッチ呼び出しの検証
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});