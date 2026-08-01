import {
  convertProcessStandardToSystemRequirements,
} from "../../src/logic/it-1-br-2-1-1";

describe("プロセス標準書のシステム要件変換機能", () => {
  // SCEN-128
  test("判定基準が複数件の場合、全件分がシステム仕様に変換される", () => {
    const input_process_standard = {
      process_id: "PROC001",
      process_name: "営業提案プロセス",
      decision_rules: [
        {
          rule_id: "JDG001",
          rule_name: "初期接触判定",
          rule_logic: "IF customer_status = 'new' THEN action = 'initial_contact'",
          priority: 1,
          applicable_department: "営業部",
        },
        {
          rule_id: "JDG002",
          rule_name: "提案内容判定",
          rule_logic:
            "IF customer_budget >= 1000000 THEN proposal_level = 'premium'",
          priority: 2,
          applicable_department: "営業部",
        },
        {
          rule_id: "JDG003",
          rule_name: "交渉進捗判定",
          rule_logic:
            "IF negotiation_count >= 3 THEN escalate_to_manager = true",
          priority: 3,
          applicable_department: "営業管理部",
        },
      ],
    };

    const result = convertProcessStandardToSystemRequirements(
      input_process_standard
    );

    expect(result.requirements).toHaveLength(3);

    expect(result.requirements[0]).toEqual({
      id: "JDG001",
      type: "DECISION_RULE",
      specification:
        "IF customer_status = 'new' THEN action = 'initial_contact'",
      priority: 1,
      applicable_department: "営業部",
    });

    expect(result.requirements[1]).toEqual({
      id: "JDG002",
      type: "DECISION_RULE",
      specification:
        "IF customer_budget >= 1000000 THEN proposal_level = 'premium'",
      priority: 2,
      applicable_department: "営業部",
    });

    expect(result.requirements[2]).toEqual({
      id: "JDG003",
      type: "DECISION_RULE",
      specification:
        "IF negotiation_count >= 3 THEN escalate_to_manager = true",
      priority: 3,
      applicable_department: "営業管理部",
    });

    expect(result.system_spec_id).toBeDefined();
    expect(result.conversion_timestamp).toBeDefined();
    expect(result.status).toBe("SUCCESS");
  });
});