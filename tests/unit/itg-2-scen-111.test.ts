import { applyNormalizationRulesInOrder } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用", () => {
  // SCEN-111
  test("正規化ルール設定が複数件の場合、全ルールを順序に従って適用する", () => {
    const normalizationRules = [
      {
        rule_id: "rule_001",
        rule_name: "電話番号のハイフン削除",
        rule_order: 1,
        target_field: "phone_number",
        pattern: /-/g,
        replacement: "",
      },
      {
        rule_id: "rule_002",
        rule_name: "会社名の全角スペースを半角に統一",
        rule_order: 2,
        target_field: "company_name",
        pattern: /　/g,
        replacement: " ",
      },
      {
        rule_id: "rule_003",
        rule_name: "郵便番号のハイフン削除",
        rule_order: 3,
        target_field: "postal_code",
        pattern: /-/g,
        replacement: "",
      },
    ];

    const inputCustomerData = {
      customer_id: "cust_001",
      phone_number: "090-1234-5678",
      company_name: "株式会社　テスト",
      postal_code: "123-4567",
    };

    const result = applyNormalizationRulesInOrder(
      inputCustomerData,
      normalizationRules
    );

    expect(result.phone_number).toBe("09012345678");
    expect(result.company_name).toBe("株式会社 テスト");
    expect(result.postal_code).toBe("1234567");
    expect(result.customer_id).toBe("cust_001");
  });
});