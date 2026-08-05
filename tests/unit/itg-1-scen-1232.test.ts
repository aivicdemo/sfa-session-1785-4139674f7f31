import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx1Imp1Agent } from "../../src/agents/tx-1-imp-1/orchestrator";
import type { Tx1Imp1AiClient } from "../../src/agents/tx-1-imp-1/types";
import * as fs from "fs";
import * as path from "path";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  let mock_ai_client: Tx1Imp1AiClient;
  let log_dir: string;

  beforeEach(() => {
    log_dir = path.join(__dirname, "../../src/agents/tx-1-imp-1/logs");
    if (!fs.existsSync(log_dir)) {
      fs.mkdirSync(log_dir, { recursive: true });
    }

    mock_ai_client = {
      validate_extraction_completeness: jest.fn(async () => ({
        is_complete: true,
        validation_status: "PASS",
        timestamp: "2024-01-15T11:00:00Z",
      })),

      calculate_data_quality_score: jest.fn(async () => ({
        quality_score: 92,
        detected_issues: [
          {
            type: "missing_field",
            field_name: "contact_date",
            occurrence_count: 2,
            severity: "low",
          },
        ],
        validation_status: "PASS",
        timestamp: "2024-01-15T11:00:01Z",
      })),

      detect_customer_duplicates: jest.fn(async () => ({
        merge_candidates: [
          {
            customer_id_1: "C001",
            customer_id_2: "C002",
            confidence: 0.8,
            fields_matching: ["company_name", "phone"],
          },
          {
            customer_id_1: "C003",
            customer_id_2: "C004",
            confidence: 0.8,
            fields_matching: ["company_name", "email"],
          },
          {
            customer_id_1: "C005",
            customer_id_2: "C006",
            confidence: 0.8,
            fields_matching: ["company_name", "address"],
          },
        ],
        validation_status: "PASS",
        timestamp: "2024-01-15T11:00:02Z",
      })),

      apply_cleaning_rules: jest.fn(async () => ({
        rows_cleaned: 1250,
        rules_applied: [
          "normalize_phone_format",
          "standardize_date_format",
          "remove_extra_whitespace",
        ],
        validation_status: "PASS",
        timestamp: "2024-01-15T11:00:03Z",
        cleaned_data_snapshot: {
          extraction_date_start: "2024-01-01",
          extraction_date_end: "2024-01-31",
          total_records: 1250,
        },
      })),

      revalidate_after_cleaning: jest.fn(async () => ({
        quality_score_after_cleaning: 78,
        remaining_anomalies: [
          {
            anomaly_type: "negative_amount",
            field_name: "sales_amount",
            occurrence_count: 5,
            sample_values: [-150, -300, -50, -100, -200],
            severity: "high",
          },
          {
            anomaly_type: "invalid_date_format",
            field_name: "contract_date",
            occurrence_count: 3,
            sample_values: ["2024-13-45", "2024-02-30", "invalid_date"],
            severity: "high",
          },
        ],
        validation_status: "FAIL_ESCALATION",
        timestamp: "2024-01-15T11:00:04Z",
      })),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    const log_files = fs.readdirSync(log_dir);
    log_files.forEach((file) => {
      fs.unlinkSync(path.join(log_dir, file));
    });
  });

  // SCEN-1232
  test("データ抽出から品質検証・クリーニングまでの自動実行 AIエージェント - クリーニングルール適用後も異常値が残存する場合に副作用確定前に人へ引き継ぐ", async () => {
    const extraction_period = {
      start_date: "2024-01-01",
      end_date: "2024-01-31",
    };

    const result = await runTx1Imp1Agent(mock_ai_client, extraction_period);

    expect(result).toBeDefined();
    expect(result.escalation_state).toBe("PENDING_HUMAN_REVIEW");
    expect(result.escalation_reason).toBe("残存異常値検出");

    expect(result.escalation_info).toBeDefined();
    expect(result.escalation_info.extraction_period).toEqual({
      start_date: "2024-01-01",
      end_date: "2024-01-31",
    });

    expect(result.escalation_info.remaining_anomalies).toEqual([
      {
        anomaly_type: "negative_amount",
        field_name: "sales_amount",
        occurrence_count: 5,
        sample_values: [-150, -300, -50, -100, -200],
        severity: "high",
      },
      {
        anomaly_type: "invalid_date_format",
        field_name: "contract_date",
        occurrence_count: 3,
        sample_values: ["2024-13-45", "2024-02-30", "invalid_date"],
        severity: "high",
      },
    ]);

    expect(result.escalation_info.applied_cleaning_rules).toEqual([
      "normalize_phone_format",
      "standardize_date_format",
      "remove_extra_whitespace",
    ]);

    expect(result.escalation_info.recommended_actions).toBeDefined();
    expect(Array.isArray(result.escalation_info.recommended_actions)).toBe(
      true
    );
    expect(result.escalation_info.recommended_actions.length).toBeGreaterThan(0);

    expect(result.data_registration_executed).toBe(false);

    const log_files = fs.readdirSync(log_dir);
    expect(log_files.length).toBeGreaterThan(0);

    const step_logs = log_files.filter((f) => f.startsWith("step_"));
    expect(step_logs.length).toBeGreaterThanOrEqual(5);

    const extraction_log_path = path.join(
      log_dir,
      step_logs.find((f) => f.includes("extract"))!
    );
    const extraction_log_content = JSON.parse(
      fs.readFileSync(extraction_log_path, "utf-8")
    );
    expect(extraction_log_content.original_data_snapshot).toBeDefined();
    expect(extraction_log_content.extraction_period).toEqual({
      start_date: "2024-01-01",
      end_date: "2024-01-31",
    });

    const cleaning_log_path = path.join(
      log_dir,
      step_logs.find((f) => f.includes("clean"))!
    );
    const cleaning_log_content = JSON.parse(
      fs.readFileSync(cleaning_log_path, "utf-8")
    );
    expect(cleaning_log_content.cleaned_data_snapshot).toBeDefined();
    expect(cleaning_log_content.intermediate_state).toEqual("AFTER_CLEANING");

    expect(result.rollback_capability).toBe(true);
    expect(result.rollback_checkpoints).toBeDefined();
    expect(Array.isArray(result.rollback_checkpoints)).toBe(true);
    expect(result.rollback_checkpoints).toContainEqual(
      expect.objectContaining({
        checkpoint_name: "extraction_complete",
      })
    );
    expect(result.rollback_checkpoints).toContainEqual(
      expect.objectContaining({
        checkpoint_name: "after_cleaning",
      })
    );

    expect(mock_ai_client.validate_extraction_completeness).toHaveBeenCalled();
    expect(mock_ai_client.calculate_data_quality_score).toHaveBeenCalled();
    expect(mock_ai_client.detect_customer_duplicates).toHaveBeenCalled();
    expect(mock_ai_client.apply_cleaning_rules).toHaveBeenCalled();
    expect(mock_ai_client.revalidate_after_cleaning).toHaveBeenCalled();

    expect(result.process_trace).toBeDefined();
    expect(Array.isArray(result.process_trace)).toBe(true);
    expect(result.process_trace.length).toBeGreaterThanOrEqual(5);

    const trace_steps = result.process_trace.map((t) => t.step_name);
    expect(trace_steps).toContain("extraction_validation");
    expect(trace_steps).toContain("quality_score_calculation");
    expect(trace_steps).toContain("duplicate_detection");
    expect(trace_steps).toContain("cleaning_rules_application");
    expect(trace_steps).toContain("post_cleaning_revalidation");
  });
});