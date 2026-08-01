import { describe, test, expect, beforeEach } from "@jest/globals";
import { recordAlertHistory } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-441
  test("アラート履歴に記録が既に存在する場合、重複なく新しいアラートが追加される", () => {
    const existing_alert = {
      alert_id: "ALERT-001",
      timestamp: new Date("2024-01-15T10:00:00Z"),
      alert_type: "推論精度低下",
      inference_accuracy: 60,
      threshold: 60,
      status: "active",
    };

    const new_alert = {
      alert_id: "ALERT-002",
      timestamp: new Date("2024-01-15T10:05:00Z"),
      alert_type: "推論精度低下",
      inference_accuracy: 55,
      threshold: 60,
      status: "active",
    };

    const alert_history = [existing_alert];

    const result = recordAlertHistory(alert_history, new_alert);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(existing_alert);
    expect(result[1]).toEqual(new_alert);
    expect(result[0].alert_id).toBe("ALERT-001");
    expect(result[1].alert_id).toBe("ALERT-002");
    expect(result[0].timestamp).toEqual(new Date("2024-01-15T10:00:00Z"));
    expect(result[1].timestamp).toEqual(new Date("2024-01-15T10:05:00Z"));
  });
});