import { validateCustomerDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1161
  test("複数件のデータ品質ルールを適用して顧客データを検証した場合、全ルールの検証結果が返される", () => {
    const rules = [
      {
        rule_id: "rule_001",
        rule_name: "顧客名が空でないこと",
        rule_type: "not_empty",
        target_field: "customer_name",
      },
      {
        rule_id: "rule_002",
        rule_name: "メールアドレスが有効な形式であること",
        rule_type: "email_format",
        target_field: "email_address",
      },
      {
        rule_id: "rule_003",
        rule_name: "売上金額が0以上の数値であること",
        rule_type: "numeric_range",
        target_field: "sales_amount",
        min_value: 0,
      },
    ];

    const customer_data = {
      customer_name: "山田太郎",
      email_address: "yamada@example.com",
      sales_amount: 150000,
    };

    const result = validateCustomerDataQuality(rules, customer_data);

    expect(result).toEqual([
      {
        rule_id: "rule_001",
        rule_name: "顧客名が空でないこと",
        status: "pass",
      },
      {
        rule_id: "rule_002",
        rule_name: "メールアドレスが有効な形式であること",
        status: "pass",
      },
      {
        rule_id: "rule_003",
        rule_name: "売上金額が0以上の数値であること",
        status: "pass",
      },
    ]);
  });
});