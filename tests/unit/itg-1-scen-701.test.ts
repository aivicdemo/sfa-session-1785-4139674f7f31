import {
  evaluateFailureReasonsAgainstApprovalCriteria,
} from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-701: 失敗要因が複数件のとき、全件が承認基準判定の対象となる", () => {
    const failureReasons = [
      {
        id: "failure_001",
        reason_code: "CUSTOMER_BUDGET_INSUFFICIENT",
        reason_text: "顧客予算不足",
        detected_at: "2024-01-15T10:30:00Z",
      },
      {
        id: "failure_002",
        reason_code: "COMPETITOR_PRIORITY",
        reason_text: "競合他社優先",
        detected_at: "2024-01-15T10:31:00Z",
      },
      {
        id: "failure_003",
        reason_code: "DELIVERY_REQUIREMENT_UNMET",
        reason_text: "納期要件未達",
        detected_at: "2024-01-15T10:32:00Z",
      },
    ];

    const approvalCriteria = {
      CUSTOMER_BUDGET_INSUFFICIENT: {
        approval_status: "CONDITIONAL_APPROVAL",
        reason_code: "BUDGET_RENEGOTIATION_POSSIBLE",
      },
      COMPETITOR_PRIORITY: {
        approval_status: "REJECTION",
        reason_code: "COMPETITIVE_DISADVANTAGE",
      },
      DELIVERY_REQUIREMENT_UNMET: {
        approval_status: "APPROVAL",
        reason_code: "DELIVERY_TIMELINE_ACHIEVABLE",
      },
    };

    const result = evaluateFailureReasonsAgainstApprovalCriteria(
      failureReasons,
      approvalCriteria
    );

    expect(result.total_evaluated).toBe(3);
    expect(result.evaluation_results).toHaveLength(3);

    expect(result.evaluation_results[0]).toEqual({
      failure_reason_id: "failure_001",
      reason_code: "CUSTOMER_BUDGET_INSUFFICIENT",
      reason_text: "顧客予算不足",
      approval_status: "CONDITIONAL_APPROVAL",
      judgment_reason_code: "BUDGET_RENEGOTIATION_POSSIBLE",
      evaluated_at: expect.any(String),
    });

    expect(result.evaluation_results[1]).toEqual({
      failure_reason_id: "failure_002",
      reason_code: "COMPETITOR_PRIORITY",
      reason_text: "競合他社優先",
      approval_status: "REJECTION",
      judgment_reason_code: "COMPETITIVE_DISADVANTAGE",
      evaluated_at: expect.any(String),
    });

    expect(result.evaluation_results[2]).toEqual({
      failure_reason_id: "failure_003",
      reason_code: "DELIVERY_REQUIREMENT_UNMET",
      reason_text: "納期要件未達",
      approval_status: "APPROVAL",
      judgment_reason_code: "DELIVERY_TIMELINE_ACHIEVABLE",
      evaluated_at: expect.any(String),
    });

    expect(result.all_evaluated_successfully).toBe(true);
    expect(result.unevaluated_count).toBe(0);
  });
});