import { normalizeCustomerData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1175
  test("正規化ルール複数件を順序どおり適用してデータを正規化した場合、全ルールが正規化された結果が返される", () => {
    const normalizationRules = [
      {
        rule_id: "rule_001",
        rule_name: "全角英数字を半角に統一",
        rule_type: "character_conversion",
        target_fields: ["customer_name", "phone"],
        conversion_logic: "full_width_to_half_width",
        priority: 1,
        active_flag: true,
      },
      {
        rule_id: "rule_002",
        rule_name: "社名の敬称を削除",
        rule_type: "text_removal",
        target_fields: ["customer_name"],
        removal_pattern: "株式会社|有限会社|合同会社",
        priority: 2,
        active_flag: true,
      },
      {
        rule_id: "rule_003",
        rule_name: "電話番号のハイフンを除去",
        rule_type: "delimiter_removal",
        target_fields: ["phone"],
        delimiter_pattern: "-",
        priority: 3,
        active_flag: true,
      },
    ];

    const inputCustomerData = {
      customer_id: "cust_001",
      customer_name: "ＡＢＣ株式会社",
      phone: "０９０-１２３４-５６７８",
    };

    const result = normalizeCustomerData(inputCustomerData, normalizationRules);

    expect(result).toEqual({
      customer_id: "cust_001",
      customer_name: "ABC",
      phone: "09012345678",
      applied_rules: ["rule_001", "rule_002", "rule_003"],
      normalization_status: "completed",
    });
  });
});