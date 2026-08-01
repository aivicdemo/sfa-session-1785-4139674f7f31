import { describe, test, expect } from "@jest/globals";
import { validateDetectionResult } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-596
  test("問題検出結果のAIエージェント推論ログIDが欠落している場合はValidationErrorをスロー", () => {
    const detection_result_missing_log_id = {
      aiAgentReasoningLogId: null,
      detectionType: "process_deviation",
      severity: "high",
      businessImpact: "成約率低下の可能性",
      requiredAction: true,
      detectionTimestamp: "2024-01-15T10:30:00Z",
    };

    expect(() => validateDetectionResult(detection_result_missing_log_id)).toThrow(
      /aiAgentReasoningLogId/
    );
  });
});