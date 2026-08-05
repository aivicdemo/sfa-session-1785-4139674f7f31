import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { evaluateAiAgentInferencePrecision } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-770: [edge] AIエージェント推論精度評価機能 - AIエージェント推論実行期間が単一日付（開始日と終了日が同日）のとき、精度スコア集計対象が正しく限定される
  test("should aggregate precision scores only for inference executions on the specified single date", () => {
    const start_date = new Date("2024-01-15T00:00:00Z");
    const end_date = new Date("2024-01-15T23:59:59Z");

    const mock_inference_logs = [
      {
        inference_log_id: "log_001",
        execution_date: new Date("2024-01-14T10:30:00Z"),
        inference_output: "proposal_A",
        actual_result: "accepted",
        precision_score: 0.92,
      },
      {
        inference_log_id: "log_002",
        execution_date: new Date("2024-01-14T14:15:00Z"),
        inference_output: "proposal_B",
        actual_result: "rejected",
        precision_score: 0.75,
      },
      {
        inference_log_id: "log_003",
        execution_date: new Date("2024-01-14T16:45:00Z"),
        inference_output: "proposal_C",
        actual_result: "pending",
        precision_score: 0.88,
      },
      {
        inference_log_id: "log_004",
        execution_date: new Date("2024-01-15T08:00:00Z"),
        inference_output: "proposal_D",
        actual_result: "accepted",
        precision_score: 0.95,
      },
      {
        inference_log_id: "log_005",
        execution_date: new Date("2024-01-15T09:30:00Z"),
        inference_output: "proposal_E",
        actual_result: "accepted",
        precision_score: 0.87,
      },
      {
        inference_log_id: "log_006",
        execution_date: new Date("2024-01-15T11:00:00Z"),
        inference_output: "proposal_F",
        actual_result: "rejected",
        precision_score: 0.72,
      },
      {
        inference_log_id: "log_007",
        execution_date: new Date("2024-01-15T13:45:00Z"),
        inference_output: "proposal_G",
        actual_result: "accepted",
        precision_score: 0.91,
      },
      {
        inference_log_id: "log_008",
        execution_date: new Date("2024-01-15T15:20:00Z"),
        inference_output: "proposal_H",
        actual_result: "pending",
        precision_score: 0.84,
      },
      {
        inference_log_id: "log_009",
        execution_date: new Date("2024-01-16T09:00:00Z"),
        inference_output: "proposal_I",
        actual_result: "accepted",
        precision_score: 0.93,
      },
      {
        inference_log_id: "log_010",
        execution_date: new Date("2024-01-16T10:30:00Z"),
        inference_output: "proposal_J",
        actual_result: "rejected",
        precision_score: 0.78,
      },
    ];

    const result = evaluateAiAgentInferencePrecision(
      start_date,
      end_date,
      mock_inference_logs
    );

    expect(result.aggregated_score_count).toBe(5);
    expect(result.included_logs).toHaveLength(5);

    const included_log_ids = result.included_logs.map(
      (log: { inference_log_id: string }) => log.inference_log_id
    );
    expect(included_log_ids).toEqual([
      "log_004",
      "log_005",
      "log_006",
      "log_007",
      "log_008",
    ]);

    const included_dates = result.included_logs.map(
      (log: { execution_date: Date }) => log.execution_date.toISOString()
    );
    included_dates.forEach((date_str: string) => {
      const date_obj = new Date(date_str);
      const year = date_obj.getUTCFullYear();
      const month = date_obj.getUTCMonth();
      const day = date_obj.getUTCDate();
      expect(year).toBe(2024);
      expect(month).toBe(0);
      expect(day).toBe(15);
    });

    expect(result.excluded_logs).toHaveLength(5);
    const excluded_log_ids = result.excluded_logs.map(
      (log: { inference_log_id: string }) => log.inference_log_id
    );
    expect(excluded_log_ids).toEqual([
      "log_001",
      "log_002",
      "log_003",
      "log_009",
      "log_010",
    ]);
  });
});