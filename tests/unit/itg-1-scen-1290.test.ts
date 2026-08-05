import { runTx10Imp1Agent } from "../../src/logic/it-1";

describe("営業データ入力から問題検出・通知までの自律実行 AIエージェント", () => {
  // SCEN-1290
  test("同じ営業データで複数回実行してもべき等性により通知とDB書き込みは初回のみ", async () => {
    // ===== Setup: Mock clients and stubs =====
    const mock_ai_client = {
      validateDataQuality: jest.fn().mockResolvedValue({
        quality_score: 92,
        has_errors: false,
        error_details: [],
      }),
      analyzeProposalContent: jest.fn().mockResolvedValue({
        conformance_score: 78,
        success_pattern_match: true,
        risk_factors: [],
      }),
      detectInappropriatePatterns: jest.fn().mockResolvedValue({
        patterns_detected: false,
        pattern_list: [],
        risk_level: "low",
        confidence_score: 0.95,
      }),
      generateAlert: jest.fn().mockResolvedValue({
        alert_id: "ALT-20250626-001",
        severity: "info",
        message: "営業データ入力処理完了",
      }),
    };

    const notification_service_calls: {
      timestamp: string;
      method: string;
      recipient: string;
      alert_id: string;
    }[] = [];
    const mock_notification_service = {
      sendEmailNotification: jest
        .fn()
        .mockImplementation(
          async (recipient: string, alert_id: string) => {
            notification_service_calls.push({
              timestamp: new Date("2025-06-26T10:00:00Z").toISOString(),
              method: "email",
              recipient,
              alert_id,
            });
          }
        ),
      sendSystemNotification: jest
        .fn()
        .mockImplementation(async (recipient: string, alert_id: string) => {
          notification_service_calls.push({
            timestamp: new Date("2025-06-26T10:00:00Z").toISOString(),
            method: "system",
            recipient,
            alert_id,
          });
        }),
    };

    const database_operations: {
      operation_type: string;
      record_type: string;
      record_id: string;
      timestamp: string;
    }[] = [];
    const mock_database = {
      insertProblemDetectionRecord: jest
        .fn()
        .mockImplementation(
          async (
            sales_data_id: string,
            detection_result: {
              risk_level: string;
              confidence_score: number;
            }
          ) => {
            database_operations.push({
              operation_type: "insert",
              record_type: "problem_detection",
              record_id: `PD-${sales_data_id}`,
              timestamp: new Date("2025-06-26T10:00:00Z").toISOString(),
            });
            return {
              problem_detection_id: `PD-${sales_data_id}`,
              created_at: new Date("2025-06-26T10:00:00Z").toISOString(),
            };
          }
        ),
    };

    const audit_log_records: {
      execution_count: number;
      sales_data_id: string;
      first_execution_id: string;
      is_duplicate_skip: boolean;
      timestamp: string;
    }[] = [];
    const mock_audit_log = {
      recordExecution: jest
        .fn()
        .mockImplementation(
          async (
            sales_data_id: string,
            is_duplicate: boolean,
            parent_execution_id?: string
          ) => {
            const new_record = {
              execution_count: audit_log_records.length + 1,
              sales_data_id,
              first_execution_id:
                parent_execution_id || `EXEC-${sales_data_id}-001`,
              is_duplicate_skip: is_duplicate,
              timestamp: new Date("2025-06-26T10:00:00Z").toISOString(),
            };
            audit_log_records.push(new_record);
            return new_record;
          }
        ),
    };

    const test_sales_data = {
      sales_data_id: "SD-2025-001",
      customer_name: "テスト顧客A",
      proposal_content: "提案内容：SaaS導入提案",
      amount_jpy: 500000,
      proposal_datetime: "2025-06-26T09:30:00Z",
      sales_representative_id: "REP-001",
      customer_id: "CUST-0001",
    };

    // ===== Execution: First run =====
    const execution_result_1 = await runTx10Imp1Agent(
      test_sales_data,
      mock_ai_client,
      mock_notification_service,
      mock_database,
      mock_audit_log
    );

    // ===== Verification: After first execution =====
    expect(execution_result_1.success).toBe(true);
    expect(execution_result_1.is_idempotent_skip).toBe(false);
    expect(notification_service_calls).toHaveLength(1);
    expect(notification_service_calls[0].alert_id).toBe("ALT-20250626-001");
    expect(notification_service_calls[0].method).toBe("email");
    expect(database_operations).toHaveLength(1);
    expect(database_operations[0].operation_type).toBe("insert");
    expect(database_operations[0].record_type).toBe("problem_detection");
    expect(audit_log_records).toHaveLength(1);
    expect(audit_log_records[0].execution_count).toBe(1);
    expect(audit_log_records[0].is_duplicate_skip).toBe(false);

    const first_execution_id = audit_log_records[0].first_execution_id;

    // ===== Execution: Second run (identical input) =====
    const execution_result_2 = await runTx10Imp1Agent(
      test_sales_data,
      mock_ai_client,
      mock_notification_service,
      mock_database,
      mock_audit_log
    );

    // ===== Verification: After second execution =====
    expect(execution_result_2.success).toBe(true);
    expect(execution_result_2.is_idempotent_skip).toBe(true);
    expect(notification_service_calls).toHaveLength(1);
    expect(database_operations).toHaveLength(1);
    expect(audit_log_records).toHaveLength(2);
    expect(audit_log_records[1].execution_count).toBe(2);
    expect(audit_log_records[1].is_duplicate_skip).toBe(true);
    expect(audit_log_records[1].first_execution_id).toBe(first_execution_id);

    // ===== Execution: Third run (identical input) =====
    const execution_result_3 = await runTx10Imp1Agent(
      test_sales_data,
      mock_ai_client,
      mock_notification_service,
      mock_database,
      mock_audit_log
    );

    // ===== Verification: After third execution =====
    expect(execution_result_3.success).toBe(true);
    expect(execution_result_3.is_idempotent_skip).toBe(true);
    expect(notification_service_calls).toHaveLength(1);
    expect(database_operations).toHaveLength(1);
    expect(audit_log_records).toHaveLength(3);
    expect(audit_log_records[2].execution_count).toBe(3);
    expect(audit_log_records[2].is_duplicate_skip).toBe(true);
    expect(audit_log_records[2].first_execution_id).toBe(first_execution_id);

    // ===== Final verification: Service call counts remain at 1 =====
    expect(mock_notification_service.sendEmailNotification).toHaveBeenCalledTimes(1);
    expect(mock_database.insertProblemDetectionRecord).toHaveBeenCalledTimes(1);
    expect(mock_audit_log.recordExecution).toHaveBeenCalledTimes(3);
  });
});