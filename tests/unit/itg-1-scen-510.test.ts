import { calculateInferenceAccuracyScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-510
  test("精度スコア算出対象期間が年度をまたぐ場合、正しく計算される", () => {
    const start_date = new Date("2024-02-01T00:00:00Z");
    const end_date = new Date("2025-01-31T23:59:59Z");

    const mock_inference_logs = [
      {
        inference_log_id: "log_001",
        inference_date: new Date("2024-02-15T10:30:00Z"),
        is_success: true,
        inference_result: "success",
      },
      {
        inference_log_id: "log_002",
        inference_date: new Date("2024-03-10T14:20:00Z"),
        is_success: true,
        inference_result: "success",
      },
      {
        inference_log_id: "log_003",
        inference_date: new Date("2024-06-05T09:15:00Z"),
        is_success: false,
        inference_result: "failed",
      },
      {
        inference_log_id: "log_004",
        inference_date: new Date("2024-12-20T16:45:00Z"),
        is_success: true,
        inference_result: "success",
      },
      {
        inference_log_id: "log_005",
        inference_date: new Date("2025-01-05T11:00:00Z"),
        is_success: true,
        inference_result: "success",
      },
      {
        inference_log_id: "log_006",
        inference_date: new Date("2025-01-25T13:30:00Z"),
        is_success: true,
        inference_result: "success",
      },
      {
        inference_log_id: "log_007",
        inference_date: new Date("2024-01-20T08:00:00Z"),
        is_success: true,
        inference_result: "success",
      },
      {
        inference_log_id: "log_008",
        inference_date: new Date("2025-02-10T12:00:00Z"),
        is_success: true,
        inference_result: "success",
      },
    ];

    const result = calculateInferenceAccuracyScore({
      start_date,
      end_date,
      inference_logs: mock_inference_logs,
    });

    expect(result.accuracy_score).toBe(83.33);
    expect(result.total_inferences).toBe(6);
    expect(result.successful_inferences).toBe(5);
    expect(result.failed_inferences).toBe(1);
    expect(result.calculation_period).toEqual({
      start: "2024-02-01T00:00:00Z",
      end: "2025-01-31T23:59:59Z",
    });
  });
});