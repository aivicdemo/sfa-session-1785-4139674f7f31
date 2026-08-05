import { describe, test, expect } from "@jest/globals";
import { validateInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-567
  test("推論ログの推論精度が欠落している場合、エラーになる", () => {
    const inference_log_with_missing_accuracy = {
      inference_log_id: "log_001",
      agent_id: "agent_001",
      inference_timestamp: new Date("2024-01-15T11:00:00Z"),
      input_data: { customer_id: "cust_001", deal_stage: "proposal" },
      output_result: { recommendation: "follow_up", confidence: 0.85 },
      inference_accuracy: null,
      created_at: new Date("2024-01-15T11:00:00Z"),
    };

    const result = expect(() =>
      validateInferenceAccuracy(inference_log_with_missing_accuracy)
    ).toThrow(/推論精度/);

    expect(result).toBeDefined();
  });
});