import { runTx1Imp1Agent } from "../../src/agents/tx-1-imp-1/orchestrator";
import type { Tx1Imp1AiClient } from "../../src/agents/tx-1-imp-1/orchestrator";

// Mock AI client factory
class MockTx1Imp1AiClient implements Tx1Imp1AiClient {
  async extractSalesProcessLogs(params: {
    start_date: string;
    end_date: string;
  }): Promise<Array<{
    record_id: string;
    customer_id: string;
    customer_name?: string;
    amount?: number;
    activity_date: string;
    status: string;
  }>> {
    // Return 100 mock log records, with 2 records missing specific fields
    const logs = [];
    for (let i = 1; i <= 100; i++) {
      const record: any = {
        record_id: `LOG-${String(i).padStart(3, "0")}`,
        customer_id: `CUST-${String(i).padStart(5, "0")}`,
        amount: i * 1000,
        activity_date: "2024-01-15",
        status: "completed",
      };

      // LOG-045 missing customer_name
      if (i === 45) {
        delete record.customer_name;
      } else {
        record.customer_name = `Customer ${i}`;
      }

      // LOG-089 missing amount
      if (i === 89) {
        delete record.amount;
      }

      logs.push(record);
    }
    return logs;
  }

  async validateCompleteness(params: {
    records: Array<{
      record_id: string;
      customer_id: string;
      customer_name?: string;
      amount?: number;
      activity_date: string;
      status: string;
    }>;
  }): Promise<{
    completeness_score: number;
    format_validation_passed: boolean;
    missing_field_count: number;
    missing_field_details: Array<{
      record_id: string;
      field: string;
    }>;
    format_errors: Array<string>;
    validation_timestamp: string;
  }> {
    const required_fields = ["customer_id", "amount", "activity_date"];
    const missing_fields: Array<{ record_id: string; field: string }> = [];

    params.records.forEach((record) => {
      required_fields.forEach((field) => {
        if (field === "customer_id" && !record.customer_id) {
          missing_fields.push({ record_id: record.record_id, field });
        }
        if (field === "amount" && record.amount === undefined) {
          missing_fields.push({ record_id: record.record_id, field });
        }
        if (field === "activity_date" && !record.activity_date) {
          missing_fields.push({ record_id: record.record_id, field });
        }
      });
    });

    const completeness_score =
      (params.records.length - missing_fields.length) / params.records.length;

    return {
      completeness_score,
      format_validation_passed: true,
      missing_field_count: missing_fields.length,
      missing_field_details: missing_fields,
      format_errors: [],
      validation_timestamp: "2024-01-31T10:15:30Z",
    };
  }

  async persistValidationLog(params: {
    validation_timestamp: string;
    validation_items: string[];
    validation_result: string;
    validator: string;
    record_ids: string[];
  }): Promise<{
    log_id: string;
    persisted: boolean;
  }> {
    return {
      log_id: `AUDIT-${Date.now()}`,
      persisted: true,
    };
  }

  async updateValidationStatus(params: {
    status: string;
    metadata: Record<string, unknown>;
  }): Promise<{
    status_updated: boolean;
    new_status: string;
  }> {
    return {
      status_updated: true,
      new_status: params.status,
    };
  }
}

describe("Sales Process Log Extraction and Validation", () => {
  test("SCEN-1223: AIエージェントが抽出データの完全性と形式を自律検証し、処理ログを永続化してロールバック可能な状態を確保する", async () => {
    // Arrange
    const aiClient = new MockTx1Imp1AiClient();
    const start_date = "2024-01-01";
    const end_date = "2024-01-31";

    // Act
    const result = await runTx1Imp1Agent({
      ai_client: aiClient,
      extraction_params: {
        start_date,
        end_date,
      },
    });

    // Assert: Action 1 - Verify extraction was performed
    expect(result.extraction_executed).toBe(true);
    expect(result.records_extracted).toBe(100);

    // Assert: Action 2 - Verify completeness and format validation was executed
    expect(result.validation_executed).toBe(true);
    expect(result.completeness_score).toBe(0.98); // (100 - 2) / 100
    expect(result.format_validation_passed).toBe(true);
    expect(result.format_errors.length).toBe(0);

    // Assert: Validation details
    expect(result.missing_field_count).toBe(2);
    expect(result.missing_field_details).toHaveLength(2);
    expect(result.missing_field_details).toContainEqual({
      record_id: "LOG-045",
      field: "customer_name",
    });
    expect(result.missing_field_details).toContainEqual({
      record_id: "LOG-089",
      field: "amount",
    });

    // Assert: Validation timestamp
    expect(result.validation_timestamp).toBe("2024-01-31T10:15:30Z");

    // Assert: No escalation condition met
    // Escalation: completeness_score < 0.95, but actual is 0.98
    expect(result.escalation_triggered).toBe(false);
    expect(result.escalation_reason).toBeUndefined();

    // Assert: Status flag updated to VALIDATION_PASSED
    expect(result.validation_status).toBe("VALIDATION_PASSED");

    // Assert: Processing log persisted
    expect(result.audit_log_persisted).toBe(true);
    expect(result.audit_log_id).toBeDefined();
    expect(result.audit_log_id).toMatch(/^AUDIT-/);

    // Assert: Metadata with missing field details passed to next step
    expect(result.next_step_metadata).toEqual({
      missing_field_details: [
        { record_id: "LOG-045", field: "customer_name" },
        { record_id: "LOG-089", field: "amount" },
      ],
      completeness_score: 0.98,
      format_validation_passed: true,
    });

    // Assert: Rollback capability ensured (log contains full context)
    expect(result.rollback_capable).toBe(true);
    expect(result.processing_log_contains_context).toBe(true);
  });
});