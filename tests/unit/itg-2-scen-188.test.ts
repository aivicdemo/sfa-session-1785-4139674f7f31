import { applyNormalizationRules } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  test("SCEN-188: 正規化ルールが1件のとき、そのルールが1回適用される", () => {
    // Arrange
    const normalization_rule_id = "NORM-001";
    const normalization_rule_name = "電話番号フォーマット統一ルール";
    const normalization_rule_pattern = /^0(\d{2})(\d{4})(\d{4})$/;
    const normalization_rule_replacement = "0$1-$2-$3";
    const applied_timestamp = new Date("2024-01-15T10:30:45Z");

    const normalization_rules = [
      {
        rule_id: normalization_rule_id,
        rule_name: normalization_rule_name,
        rule_pattern: normalization_rule_pattern,
        rule_replacement: normalization_rule_replacement,
        is_active: true,
      },
    ];

    const sales_data_input = {
      sales_data_id: "SALES-001",
      phone_number: "09012345678",
    };

    // Act
    const result = applyNormalizationRules(
      normalization_rules,
      sales_data_input,
      applied_timestamp
    );

    // Assert
    expect(result.normalized_phone_number).toBe("090-1234-5678");
    expect(result.rule_application_log).toHaveLength(1);
    expect(result.rule_application_log[0]).toEqual({
      rule_id: normalization_rule_id,
      rule_name: normalization_rule_name,
      applied_count: 1,
      applied_timestamp: applied_timestamp.toISOString(),
      applied_data_id: sales_data_input.sales_data_id,
    });
  });
});