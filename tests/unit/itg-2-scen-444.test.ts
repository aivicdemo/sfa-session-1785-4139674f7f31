import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-444
  test("正規化ルール適用後に顧客名が完全に一致する場合、重複と判定される", () => {
    const recordA = {
      customer_id: "CUST001",
      customer_name: "株式会社　ＡＢＣ　商事",
      normalized_name: "",
    };

    const recordB = {
      customer_id: "CUST002",
      customer_name: "(株)ABC商事",
      normalized_name: "",
    };

    const normalization_rules = [
      { rule_id: "RULE001", rule_type: "space_removal", pattern: "\\s+", replacement: "" },
      { rule_id: "RULE002", rule_type: "bracket_unification", pattern: "（|\\(", replacement: "(" },
      { rule_id: "RULE003", rule_type: "bracket_unification", pattern: "）|\\)", replacement: ")" },
      { rule_id: "RULE004", rule_type: "fullwidth_to_halfwidth", pattern: "[Ａ-Ｚａ-ｚ０-９]", replacement: "halfwidth" },
    ];

    const result = detectDuplicateCustomers(
      [recordA, recordB],
      normalization_rules
    );

    expect(result.duplicate_detected).toBe(true);
    expect(result.record_a_id).toBe("CUST001");
    expect(result.record_b_id).toBe("CUST002");
    expect(result.normalized_name_a).toBe("株式会社ABC商事");
    expect(result.normalized_name_b).toBe("株式会社ABC商事");
    expect(result.merge_group_id).toBe(result.merge_group_id);
    expect(typeof result.merge_group_id).toBe("string");
    expect(result.merge_group_id.length).toBeGreaterThan(0);
  });
});