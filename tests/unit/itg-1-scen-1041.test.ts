import { describe, test, expect, beforeEach } from "@jest/globals";
import { calculateAiInferencePrecisionAlertStatus } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度自動監視とアラート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1041
  test("精度判定結果が欠落しているときアラート生成がエラーになること", () => {
    const inference_precision_result_missing = {
      ai_agent_inference_log_id: "log_20240115_001",
      inference_timestamp: new Date("2024-01-15T11:00:00Z"),
      inference_output_json: '{"recommendation":"提案内容を修正してください"}',
      inference_confidence_score: 0.85,
      // 意図的に precision_result_value を削除・欠落させる
    };

    expect(() =>
      calculateAiInferencePrecisionAlertStatus(
        inference_precision_result_missing as any
      )
    ).toThrow(/精度判定結果/);
  });
});