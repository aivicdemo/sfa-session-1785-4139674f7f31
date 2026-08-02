import { normalizeDuplicateCustomerData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-107
  test("正規化ルールが適用され、前後の空白が削除される", () => {
    const input_customer_name = "　田中太郎　";
    const input_normalization_rule = {
      rule_id: "WHITESPACE_TRIM",
      rule_name: "前後空白削除",
      enabled: true,
      priority: 1,
    };

    const result = normalizeDuplicateCustomerData(
      input_customer_name,
      input_normalization_rule
    );

    expect(result.normalized_customer_name).toBe("田中太郎");
    expect(result.rule_applied).toBe(true);
    expect(result.applied_rule_type).toBe("WHITESPACE_TRIM");
  });
});