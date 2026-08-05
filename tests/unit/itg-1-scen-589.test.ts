import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { analyzeAgentInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  let alertHistoryRecords: Array<{
    timestamp: string;
    precision: number;
    threshold: number;
    alert_type: string;
    status: string;
  }> = [];

  let mockAlertService: {
    recordAlert: (record: any) => void;
    getAlertHistory: () => Array<any>;
    getAlertStatus: () => string;
  };

  beforeEach(() => {
    alertHistoryRecords = [];
    mockAlertService = {
      recordAlert: (record: any) => {
        alertHistoryRecords.push(record);
      },
      getAlertHistory: () => alertHistoryRecords,
      getAlertStatus: () => {
        return alertHistoryRecords.length > 0 ? "ALERT_TRIGGERED" : "NORMAL";
      },
    };
  });

  afterEach(() => {
    alertHistoryRecords = [];
  });

  // SCEN-589
  test("推論精度がちょうど監視閾値に一致する場合、アラート発火判定と履歴記録が正常に実行される", () => {
    const monitoring_threshold = 75.0;
    const inferred_precision = 75.0;
    const fixed_timestamp = "2024-06-15T14:30:00Z";
    const expected_alert_type = "THRESHOLD_MATCH";
    const expected_status = "ACTIVE";

    const result = analyzeAgentInferenceAccuracy({
      inferred_precision,
      monitoring_threshold,
      timestamp: fixed_timestamp,
      alert_service: mockAlertService,
    });

    expect(result.alert_status).toBe("ALERT_TRIGGERED");
    expect(result.precision_matches_threshold).toBe(true);

    const alert_history = mockAlertService.getAlertHistory();
    expect(alert_history).toHaveLength(1);

    const recorded_alert = alert_history[0];
    expect(recorded_alert.timestamp).toBe(fixed_timestamp);
    expect(recorded_alert.precision).toBe(75.0);
    expect(recorded_alert.threshold).toBe(75.0);
    expect(recorded_alert.alert_type).toBe(expected_alert_type);
    expect(recorded_alert.status).toBe(expected_status);
  });
});