import { applyNormalizationRules } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1142
  test("正規化ルールが存在しないフィールドの場合、元のデータが保持される", () => {
    const input_customer_data = {
      customer_id: "CUST_001",
      customer_name: "テスト太郎",
      email: "test@example.com",
      remarks: "これは備考欄です　　特殊文字：★◆☆",
      phone: "090-1234-5678",
      address: "東京都渋谷区",
    };

    const normalization_rules = [
      {
        rule_id: "NORM_001",
        target_field: "customer_name",
        rule_type: "trim_whitespace",
        rule_definition: "前後の空白を削除",
      },
      {
        rule_id: "NORM_002",
        target_field: "email",
        rule_type: "lowercase",
        rule_definition: "小文字に統一",
      },
      {
        rule_id: "NORM_003",
        target_field: "phone",
        rule_type: "remove_hyphens",
        rule_definition: "ハイフンを削除",
      },
    ];

    const result = applyNormalizationRules(
      input_customer_data,
      normalization_rules
    );

    expect(result.remarks).toBe(
      "これは備考欄です　　特殊文字：★◆☆"
    );
    expect(result.address).toBe("東京都渋谷区");
  });
});