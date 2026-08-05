import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import type { Tx3Imp1AiClient } from "../../../src/agents/tx-3-imp-1/ai-client";
import { runTx3Imp1Agent } from "../../../src/agents/tx-3-imp-1/orchestrator";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  let mock_ai_client: Tx3Imp1AiClient;
  let mock_call_count: number;

  beforeEach(() => {
    mock_call_count = 0;
    mock_ai_client = {
      invokeInferencePrecisionEvaluation: jest
        .fn()
        .mockImplementation(async () => {
          mock_call_count++;
          return {
            precision: 0.876,
            recall: 0.841,
            f1_score: 0.858,
            evaluated_sample_size: 1250,
            baseline_comparison: {
              target: 0.9,
              variance: -0.024,
            },
            confidence_level: "high",
          };
        }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1260
  test("should execute inference precision evaluation autonomously and return complete diagnostic results with all precision metrics", async () => {
    const fixed_current_time = new Date("2024-01-15T11:00:00Z");
    const trigger_payload = {
      trigger_type: "scheduled_health_check",
      last_evaluation_at: new Date("2024-01-14T10:55:00Z"),
      system_context: {
        evaluation_mode: "inference_precision",
        data_quality_score: 0.95,
      },
    };

    const diagnostic_result = await runTx3Imp1Agent(
      trigger_payload,
      mock_ai_client,
      fixed_current_time
    );

    expect(mock_call_count).toBe(1);
    expect(mock_ai_client.invokeInferencePrecisionEvaluation).toHaveBeenCalledTimes(
      1
    );

    const inference_precision_section =
      diagnostic_result.inference_precision_evaluation;

    expect(inference_precision_section).toBeDefined();
    expect(inference_precision_section.precision).toBe(0.876);
    expect(inference_precision_section.recall).toBe(0.841);
    expect(inference_precision_section.f1_score).toBe(0.858);
    expect(inference_precision_section.evaluated_sample_size).toBe(1250);
    expect(inference_precision_section.baseline_comparison.target).toBe(0.9);
    expect(inference_precision_section.baseline_comparison.variance).toBe(
      -0.024
    );
    expect(inference_precision_section.confidence_level).toBe("high");

    expect(diagnostic_result.evaluation_type).toBe("inference_precision");

    const executed_timestamp = new Date(diagnostic_result.executed_at);
    const time_diff_ms = Math.abs(
      executed_timestamp.getTime() - fixed_current_time.getTime()
    );
    expect(time_diff_ms).toBeLessThanOrEqual(5000);

    expect(diagnostic_result.executed_at).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );

    expect(diagnostic_result.diagnosis_stage).toBe("integrated_analysis");
    expect(diagnostic_result.system_health_section).toBeDefined();
    expect(diagnostic_result.data_quality_section).toBeDefined();
  });
});