import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1001: [edge] 成功要因・失敗要因の抽出と承認基準判定機能 - 要因抽出の月初に承認申請が行われるとき月初日の承認が有効である
  test("SCEN-1001: should validate approval criteria for success factor extraction at month start", async () => {
    const { evaluateApprovalCriteria } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const test_execution_date = new Date("2024-04-01T00:00:00Z");
    const approval_request_date = new Date("2024-04-01T00:00:00Z");

    const success_factors = [
      {
        factor_id: "sf_001",
        factor_name: "初回接触から提案までの期間が14日以内",
        frequency_count: 8,
        deal_success_rate: 0.75,
      },
      {
        factor_id: "sf_002",
        factor_name: "複数部門への提案実施",
        frequency_count: 6,
        deal_success_rate: 0.83,
      },
    ];

    const failure_factors = [
      {
        factor_id: "ff_001",
        factor_name: "初回接触後30日以上フォローアップなし",
        frequency_count: 5,
        deal_failure_rate: 0.6,
      },
      {
        factor_id: "ff_002",
        factor_name: "単一部門のみへの提案",
        frequency_count: 7,
        deal_failure_rate: 0.71,
      },
    ];

    const approval_request_obj = {
      request_id: "req_20240401_001",
      request_date: approval_request_date,
      extraction_start_date: new Date("2024-03-01T00:00:00Z"),
      extraction_end_date: new Date("2024-03-31T23:59:59Z"),
      success_factors: success_factors,
      failure_factors: failure_factors,
      extracted_by_agent_id: "agent_ai_001",
      classification_accuracy_score: 0.92,
    };

    const approval_criteria_result = evaluateApprovalCriteria(
      approval_request_obj,
      test_execution_date
    );

    expect(approval_criteria_result).toEqual({
      approval_request_id: "req_20240401_001",
      approval_status: "approved",
      approval_validity: true,
      approval_date: new Date("2024-04-01T00:00:00Z"),
      is_month_start_approval: true,
      applicable_period_start: new Date("2024-04-01T00:00:00Z"),
      applicable_period_end: new Date("2024-04-30T23:59:59Z"),
      approved_success_factors_count: 2,
      approved_failure_factors_count: 2,
      approval_classification_accuracy: 0.92,
      validation_message:
        "月初日の承認申請です。当月の監査・分析に適用されます。",
    });

    expect(approval_criteria_result.approval_status).toBe("approved");
    expect(approval_criteria_result.approval_validity).toBe(true);
    expect(approval_criteria_result.is_month_start_approval).toBe(true);
    expect(approval_criteria_result.applicable_period_start).toEqual(
      new Date("2024-04-01T00:00:00Z")
    );
    expect(approval_criteria_result.applicable_period_end).toEqual(
      new Date("2024-04-30T23:59:59Z")
    );
    expect(approval_criteria_result.approved_success_factors_count).toBe(2);
    expect(approval_criteria_result.approved_failure_factors_count).toBe(2);
  });
});