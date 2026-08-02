import { decideDuplicateJudgment } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データ重複検知・統合判定機能", () => {
  // SCEN-526
  test("重複基準の必須判定項目が片方で欠落している場合、統合対象外と判定される", () => {
    const duplicate_rule = {
      rule_id: "DR001",
      required_judgment_items: ["customer_name", "phone_number"],
      optional_judgment_items: [],
    };

    const customer_a = {
      customer_id: "CUST001",
      customer_name: "田中太郎",
      phone_number: "09012345678",
      email: "tanaka@example.com",
    };

    const customer_b = {
      customer_id: "CUST002",
      customer_name: "田中太郎",
      phone_number: null,
      email: "tanaka.b@example.com",
    };

    const result = decideDuplicateJudgment(
      duplicate_rule,
      customer_a,
      customer_b
    );

    expect(result.integration_judgment).toBe("non_integration_target");
    expect(result.is_candidate_pair).toBe(false);
    expect(result.reason).toMatch(/必須判定項目/);
  });
});