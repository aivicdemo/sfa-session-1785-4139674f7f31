import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateSystemHealthCheckReport } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-373
  test("複数のアラート履歴に同一の推論精度値が並ぶ場合に正常に処理される", () => {
    const alert_history_records = [
      {
        alert_id: "ALERT_001",
        timestamp: new Date("2024-01-15T10:00:00Z"),
        alert_type: "inference_accuracy_low",
        inference_accuracy: 0.85,
        system_health_status: "healthy",
        data_quality_score: 0.92,
      },
      {
        alert_id: "ALERT_002",
        timestamp: new Date("2024-01-15T11:30:00Z"),
        alert_type: "data_quality_degradation",
        inference_accuracy: 0.85,
        system_health_status: "healthy",
        data_quality_score: 0.88,
      },
      {
        alert_id: "ALERT_003",
        timestamp: new Date("2024-01-15T13:00:00Z"),
        alert_type: "system_performance_warning",
        inference_accuracy: 0.85,
        system_health_status: "warning",
        data_quality_score: 0.90,
      },
    ];

    const report = generateSystemHealthCheckReport(alert_history_records);

    expect(report.total_alerts_processed).toBe(3);

    expect(report.inference_accuracy_statistics.average_accuracy).toBe(0.85);
    expect(report.inference_accuracy_statistics.max_accuracy).toBe(0.85);
    expect(report.inference_accuracy_statistics.min_accuracy).toBe(0.85);
    expect(report.inference_accuracy_statistics.accuracy_count).toBe(3);

    expect(report.alert_records_included).toHaveLength(3);

    expect(report.alert_records_included).toContainEqual(
      expect.objectContaining({
        alert_id: "ALERT_001",
        inference_accuracy: 0.85,
      })
    );

    expect(report.alert_records_included).toContainEqual(
      expect.objectContaining({
        alert_id: "ALERT_002",
        inference_accuracy: 0.85,
      })
    );

    expect(report.alert_records_included).toContainEqual(
      expect.objectContaining({
        alert_id: "ALERT_003",
        inference_accuracy: 0.85,
      })
    );

    expect(report.data_quality_aggregation.average_score).toBe(0.9);
    expect(report.data_quality_aggregation.max_score).toBe(0.92);
    expect(report.data_quality_aggregation.min_score).toBe(0.88);

    expect(report.is_sorted_by_timestamp).toBe(true);
    expect(report.sorting_order).toBe("ascending");

    expect(report.has_duplicates).toBe(false);
    expect(report.data_completeness_percentage).toBe(100);

    expect(report.report_generated_at).toBeDefined();
    expect(typeof report.report_generated_at).toBe("string");

    expect(report.is_downloadable).toBe(true);
    expect(report.download_format).toBe("json");

    const timestamps = report.alert_records_included.map((r) =>
      new Date(r.timestamp).getTime()
    );
    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i - 1]);
    }

    const accuracy_values = report.alert_records_included.map(
      (r) => r.inference_accuracy
    );
    expect(accuracy_values).toEqual([0.85, 0.85, 0.85]);
  });
});