import { applyDataQualityRules } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-815
  test("正規化ルール定義が欠落している場合、データ品質ルール適用がエラーになる", () => {
    const customerData = {
      customer_id: "CUST001",
      customer_name: "山田　太郎",
      email: "YAMADA@EXAMPLE.COM",
      phone: "090-1234-5678",
      address: "東京都渋谷区",
    };

    const normalizationRuleDefinition = null;

    const engine = {
      normalization_rules: normalizationRuleDefinition,
      data_quality_rules: [
        {
          rule_id: "DQR001",
          rule_name: "顧客名正規化",
          rule_type: "NORMALIZATION",
          target_field: "customer_name",
        },
        {
          rule_id: "DQR002",
          rule_name: "メールアドレス正規化",
          rule_type: "NORMALIZATION",
          target_field: "email",
        },
      ],
    };

    expect(() =>
      applyDataQualityRules(customerData, engine)
    ).toThrow(/正規化ルール定義/);
  });
});