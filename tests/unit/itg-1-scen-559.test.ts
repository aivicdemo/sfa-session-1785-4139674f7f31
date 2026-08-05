import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-559", () => {
    const fetchMock = require("jest-fetch-mock");
    fetchMock.enableMocks();

    beforeEach(() => {
      fetchMock.resetMocks();
    });

    afterEach(() => {
      fetchMock.disableMocks();
    });

    // Import the logic function
    const {
      monitorAIInferenceAccuracy,
    } = require("../../src/logic/it-1-br-2-1-1-1");

    // Setup: Mock AI inference log database with no records
    const target_agent_id = "AGENT-001";
    const monitoring_execution_id = "MON-2024-01-15-001";
    const expected_error_code = "ERR_INFERENCE_LOG_MISSING";
    const expected_error_message = "推論ログが見つかりません";
    const expected_alert_status = "ERROR";

    // Mock response: empty inference log array (simulating missing logs)
    fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });

    // Mock response for alert generation
    const alert_id = "ALERT-2024-01-15-001";
    const alert_generated_at = new Date("2024-01-15T10:30:00Z");
    fetchMock.mockResponseOnce(
      JSON.stringify({
        alert_id: alert_id,
        agent_id: target_agent_id,
        alert_status: expected_alert_status,
        error_code: expected_error_code,
        error_message: expected_error_message,
        created_at: alert_generated_at.toISOString(),
      }),
      { status: 201 }
    );

    // Execute: Call monitoring function with target agent
    const result = monitorAIInferenceAccuracy({
      agent_id: target_agent_id,
      monitoring_id: monitoring_execution_id,
      check_timestamp: new Date("2024-01-15T10:30:00Z"),
    });

    // Verify: Check error response structure
    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.error_code).toBe(expected_error_code);
    expect(result.error_message).toMatch(/推論ログが見つかりません/);

    // Verify: Check alert generation
    expect(result.alert).toBeDefined();
    expect(result.alert.alert_id).toBe(alert_id);
    expect(result.alert.agent_id).toBe(target_agent_id);
    expect(result.alert.alert_status).toBe(expected_alert_status);
    expect(result.alert.error_code).toBe(expected_error_code);

    // Verify: Check fetch calls were made
    expect(fetchMock.mock.calls).toHaveLength(2);
    expect(fetchMock.mock.calls[0][0]).toMatch(/inference_logs/);
    expect(fetchMock.mock.calls[1][0]).toMatch(/alerts/);

    // Verify: HTTP status codes
    expect(fetchMock.mock.results[0].status).toBe(200);
    expect(fetchMock.mock.results[1].status).toBe(201);

    fetchMock.disableMocks();
  });
});