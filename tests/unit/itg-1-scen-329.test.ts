import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx3Imp1Agent } from "../../src/agents/tx-3-imp-1/orchestrator";

const fetchMock = require("jest-fetch-mock");

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-329
  test("システムヘルスチェック実行機能 - 営業データ品質チェックの合格基準が未設定のとき、エラーが発生する", async () => {
    const trigger_type = "scheduled_monitoring";
    const trigger_timestamp = new Date("2024-01-15T09:00:00Z").toISOString();

    const mock_health_check_response = {
      timestamp: trigger_timestamp,
      system_status: "healthy",
      database_connection: "ok",
      api_availability: "ok",
      response_time_ms: 145,
    };

    fetchMock.mockResponseOnce(JSON.stringify(mock_health_check_response), {
      status: 200,
    });

    const orchestrator_input = {
      trigger_type: trigger_type,
      trigger_timestamp: trigger_timestamp,
      threshold_config: null,
      audit_log_enabled: true,
    };

    let error_caught: Error | null = null;
    let result_output: unknown = null;

    try {
      result_output = await runTx3Imp1Agent(orchestrator_input);
    } catch (e) {
      error_caught = e instanceof Error ? e : new Error(String(e));
    }

    expect(error_caught).not.toBeNull();
    expect(error_caught?.message).toMatch(/Data quality threshold config/i);

    const log_records = (result_output as any)?.execution_log;
    if (!log_records) {
      expect(error_caught?.message).toBeDefined();
      expect(error_caught?.message).toMatch(/threshold/i);
    }
  });
});