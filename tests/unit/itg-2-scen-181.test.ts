import { applyNormalizationRulesByPriority } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 正規化ルール優先度適用", () => {
  // SCEN-181
  test("クリーニング優先度が決定されたとき、正規化ルールが優先度順に適用される", () => {
    const input_raw_data = {
      customer_name: "  テスト太郎  ",
      postal_code: "1234567",
      phone_number: "09012345678",
      email: "TEST@EXAMPLE.COM",
    };

    const normalization_rules = [
      {
        rule_id: "RULE_A",
        priority: 1,
        rule_type: "trim_whitespace",
        target_field: "customer_name",
      },
      {
        rule_id: "RULE_B",
        priority: 2,
        rule_type: "format_postal_code",
        target_field: "postal_code",
      },
      {
        rule_id: "RULE_C",
        priority: 3,
        rule_type: "normalize_phone",
        target_field: "phone_number",
      },
    ];

    const result = applyNormalizationRulesByPriority({
      raw_data: input_raw_data,
      rules: normalization_rules,
    });

    expect(result.cleaned_data.customer_name).toBe("テスト太郎");
    expect(result.cleaned_data.postal_code).toBe("123-4567");
    expect(result.cleaned_data.phone_number).toBe("090-1234-5678");
    expect(result.cleaned_data.email).toBe("test@example.com");

    expect(result.execution_trace).toEqual([
      {
        sequence: 1,
        rule_id: "RULE_A",
        priority: 1,
        status: "applied",
      },
      {
        sequence: 2,
        rule_id: "RULE_B",
        priority: 2,
        status: "applied",
      },
      {
        sequence: 3,
        rule_id: "RULE_C",
        priority: 3,
        status: "applied",
      },
    ]);

    expect(result.total_rules_applied).toBe(3);
  });
});