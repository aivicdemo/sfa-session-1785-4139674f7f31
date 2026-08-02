import { normalizeCustomerData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1174
  test("正規化ルール1件を適用してデータを正規化した場合、当該ルールの正規化結果が返される", () => {
    const normalization_rule_id = "rule_001";
    const normalization_rule_type = "trim";
    const normalization_rule_target_field = "customer_name";
    const normalization_rule_pattern = "^\\s+|\\s+$";
    const normalization_rule_replacement = "";

    const customer_data_input = {
      customer_id: "cust_12345",
      customer_name: "  山田太郎  ",
      customer_email: "yamada@example.com",
    };

    const normalization_rules = [
      {
        rule_id: normalization_rule_id,
        rule_type: normalization_rule_type,
        target_field: normalization_rule_target_field,
        pattern: normalization_rule_pattern,
        replacement: normalization_rule_replacement,
      },
    ];

    const result = normalizeCustomerData(customer_data_input, normalization_rules);

    expect(result).toEqual({
      customer_id: "cust_12345",
      customer_name: "山田太郎",
      customer_email: "yamada@example.com",
      normalization_results: [
        {
          rule_id: normalization_rule_id,
          target_field: normalization_rule_target_field,
          applied_status: "success",
          value_before: "  山田太郎  ",
          value_after: "山田太郎",
        },
      ],
    });
  });
});