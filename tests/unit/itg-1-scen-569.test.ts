import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { validateInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-569
  test("推論ログの推論精度が100を超える場合、エラーになる", () => {
    const inference_log_data = {
      inference_log_id: "log_001",
      agent_id: "agent_ai_001",
      inference_timestamp: "2024-01-15T11:30:00Z",
      inference_accuracy: 101,
      input_data: {
        customer_id: "cust_123",
        sales_stage: "proposal",
      },
      output_result: {
        recommendation: "follow_up_email",
        confidence_score: 0.87,
      },
      execution_status: "completed",
    };

    expect(() => validateInferenceAccuracy(inference_log_data)).toThrow(
      /推論精度が有効範囲を超えています/
    );
  });
});