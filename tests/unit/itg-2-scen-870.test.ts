import { normalizeCustomerData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-870
  test("正規化ルールが複数件のとき、全てのルールが順序どおり適用される", () => {
    const normalizationRules = [
      {
        rule_id: "rule_001",
        rule_order: 1,
        rule_type: "half_to_full_katakana",
        pattern: null,
        replacement: null,
      },
      {
        rule_id: "rule_002",
        rule_order: 2,
        rule_type: "full_to_half_alphanumeric",
        pattern: null,
        replacement: null,
      },
      {
        rule_id: "rule_003",
        rule_order: 3,
        rule_type: "trim_whitespace",
        pattern: null,
        replacement: null,
      },
    ];

    const inputData = "　ｶﾀｶﾅ　１２３４";

    const result = normalizeCustomerData({
      input_data: inputData,
      normalization_rules: normalizationRules,
    });

    expect(result.normalized_data).toBe("カタカナ1234");
    expect(result.applied_rules).toEqual([
      "rule_001",
      "rule_002",
      "rule_003",
    ]);
  });
});