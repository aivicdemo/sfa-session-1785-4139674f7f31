import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { monitorAiInferencePrecision } from "../../src/logic/it-1-br-2-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-351
  test("should throw NotificationDestinationNotConfiguredError when alert notification destination is not configured", async () => {
    const monitoringRuleId = "rule-001";
    const monitoringRule = {
      id: monitoringRuleId,
      name: "Inference Precision Monitor",
      trigger_threshold: 70,
      trigger_type: "below_threshold",
      metric_type: "inference_precision_percentage",
    };

    const testInferenceData = {
      agent_id: "agent-123",
      total_inferences: 100,
      correct_inferences: 65,
      inference_precision_percentage: 65,
      evaluation_timestamp: "2024-01-15T10:30:00Z",
    };

    const monitoringConfig = {
      monitoring_rule_id: monitoringRuleId,
      notification_destinations: [] as string[],
      alert_enabled: true,
      created_at: "2024-01-15T09:00:00Z",
    };

    expect(() =>
      monitorAiInferencePrecision(
        monitoringRule,
        testInferenceData,
        monitoringConfig
      )
    ).toThrow(/アラート通知先が設定されていません/);
  });
});