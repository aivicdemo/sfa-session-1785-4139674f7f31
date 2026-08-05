import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { monitorInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  let alertHistoryLog: Array<{
    timestamp: string;
    inferenceAccuracyPercent: number;
    alertTriggered: boolean;
    monitoringStatus: string;
  }> = [];

  beforeEach(() => {
    alertHistoryLog = [];
  });

  afterEach(() => {
    alertHistoryLog = [];
  });

  // SCEN-652
  test("推論精度が監視閾値直上（95.1%）のとき、アラートが発生しない", () => {
    // 入力条件
    const alertThresholdPercent = 95.0;
    const inferenceAccuracyPercent = 95.1;
    const monitoringTimestamp = "2024-06-15T10:30:00Z";

    // モックデータの構築
    const inferenceAccuracyData = {
      timestamp: monitoringTimestamp,
      accuracyPercent: inferenceAccuracyPercent,
      totalInferences: 1000,
      correctInferences: 951,
    };

    const monitoringConfig = {
      alertThresholdPercent: alertThresholdPercent,
      monitoringEnabled: true,
    };

    // 実行
    const result = monitorInferenceAccuracy(
      inferenceAccuracyData,
      monitoringConfig
    );

    // 期待結果1: アラートが発生していない
    expect(result.alertTriggered).toBe(false);

    // 期待結果2: 監視ステータスが「正常」
    expect(result.monitoringStatus).toBe("normal");

    // 期待結果3: 記録された推論精度が正確
    expect(result.recordedAccuracyPercent).toBe(95.1);

    // 期待結果4: アラート発生履歴ログにエントリが記録されていない
    expect(result.alertHistoryCount).toBe(0);
  });
});