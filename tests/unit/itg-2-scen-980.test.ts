import { validateQualityRules } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-980
  test("購買結果記録・営業データ統合機能 - 購買結果の品質検証ルールが1件適用される場合に正しく検証される", () => {
    const purchase_data = {
      customer_id: "CUST001",
      product_id: "PROD001",
      purchase_amount: 50000,
      purchase_date: "2024-01-15",
    };

    const quality_rules = [
      {
        rule_id: "QR001",
        rule_name: "購買金額が10000円以上100000円以下であることを検証する",
        field_name: "purchase_amount",
        min_value: 10000,
        max_value: 100000,
      },
    ];

    const validation_result = validateQualityRules(
      purchase_data,
      quality_rules
    );

    expect(validation_result).toEqual({
      validation_status: "合格",
      error_message: "",
      applied_rule_count: 1,
      applied_rules: [
        {
          rule_id: "QR001",
          rule_name: "購買金額が10000円以上100000円以下であることを検証する",
          result: "合格",
        },
      ],
    });
  });
});