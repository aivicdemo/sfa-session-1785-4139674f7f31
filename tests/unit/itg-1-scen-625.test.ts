import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { checkInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-625
  test("[error] AIエージェント推論精度の自動監視とアラート機能 - AIエージェント推論精度データが欠落しているときエラーになる", async () => {
    const agent_id = "agent_20240115_001";
    const monitoring_start_date = "2024-01-01";
    const monitoring_end_date = "2024-01-31";

    fetchMock.mockResponseOnce(JSON.stringify(null), { status: 200 });

    fetchMock.mockResponseOnce(
      JSON.stringify({
        alert_id: "alert_20240115_001",
        agent_id: agent_id,
        alert_level: "CRITICAL",
        alert_type: "推論精度データ欠落",
        message: "推論精度データが利用できません",
        created_at: "2024-01-15T10:30:00Z",
        rows_inserted: 1,
      }),
      { status: 200 }
    );

    let error_thrown: any = null;

    try {
      await checkInferenceAccuracy({
        agent_id: agent_id,
        monitoring_start_date: monitoring_start_date,
        monitoring_end_date: monitoring_end_date,
      });
    } catch (err) {
      error_thrown = err;
    }

    expect(error_thrown).not.toBeNull();
    expect(error_thrown.code).toBe("ERR_INFERENCE_DATA_MISSING");
    expect(error_thrown.message).toMatch(/推論精度データが利用できません/);

    expect(fetchMock).toHaveBeenCalledTimes(2);

    const first_call_args = fetchMock.mock.calls[0];
    expect(first_call_args[0]).toContain("/api/inference-accuracy");

    const second_call_args = fetchMock.mock.calls[1];
    expect(second_call_args[0]).toContain("/api/alerts");
    expect(second_call_args[1].method).toBe("POST");

    const alert_request_body = JSON.parse(second_call_args[1].body);
    expect(alert_request_body.agent_id).toBe(agent_id);
    expect(alert_request_body.alert_level).toBe("CRITICAL");
    expect(alert_request_body.alert_type).toBe("推論精度データ欠落");
    expect(alert_request_body.message).toContain("推論精度データが利用できません");
  });
});