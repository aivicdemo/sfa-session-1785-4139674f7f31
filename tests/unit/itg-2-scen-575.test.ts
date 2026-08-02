import { judgeRuleApproval } from "../../src/logic/it-1-br-2-2-1-1";

describe("修正ルール承認判定機能 - 承認権限フラグ検証", () => {
  // SCEN-575
  test("修正ルール案の承認権限フラグが欠けている場合、権限判定が失敗する", () => {
    const rule_case_null = {
      ruleId: "RULE_001",
      ruleName: "顧客重複マージルール",
      correctionContent: "同一企業の重複顧客を統合",
      proposerId: "USER_002",
      createdAt: new Date("2024-01-15T10:00:00Z"),
      approvalAuthorityFlag: null,
    };

    const approval_context = {
      approverId: "USER_001",
      approvalAuthLevel: 2,
    };

    expect(() =>
      judgeRuleApproval(rule_case_null, approval_context)
    ).toThrow(/APPROVAL_AUTHORITY_FLAG_MISSING/);
  });
});