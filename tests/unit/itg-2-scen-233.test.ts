import { convertQualityRulesRequirements } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 要件仕様変換", () => {
  // SCEN-233
  test("複数件の判定基準が全て要件仕様に正常に変換される", () => {
    const qualityRules = [
      {
        rule_id: "RULE_001",
        rule_name: "金額範囲チェック",
        check_type: "amount_range",
        min_value: 10000,
        max_value: 5000000,
        error_message: "金額",
        is_active: true,
      },
      {
        rule_id: "RULE_002",
        rule_name: "日付妥当性チェック",
        check_type: "date_validity",
        start_date: "2024-01-01",
        end_date: "2024-12-31",
        error_message: "日付",
        is_active: true,
      },
      {
        rule_id: "RULE_003",
        rule_name: "営業担当者コード存在チェック",
        check_type: "code_exists",
        code_list: ["EMP001", "EMP002", "EMP003"],
        error_message: "営業担当者",
        is_active: true,
      },
    ];

    const result = convertQualityRulesRequirements(qualityRules);

    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      internal_spec_id: "RULE_001",
      spec_name: "金額範囲チェック",
      spec_type: "amount_range",
      requirements: {
        min_value: 10000,
        max_value: 5000000,
      },
      error_message: "金額",
      status: "converted",
    });

    expect(result[1]).toEqual({
      internal_spec_id: "RULE_002",
      spec_name: "日付妥当性チェック",
      spec_type: "date_validity",
      requirements: {
        start_date: "2024-01-01",
        end_date: "2024-12-31",
      },
      error_message: "日付",
      status: "converted",
    });

    expect(result[2]).toEqual({
      internal_spec_id: "RULE_003",
      spec_name: "営業担当者コード存在チェック",
      spec_type: "code_exists",
      requirements: {
        code_list: ["EMP001", "EMP002", "EMP003"],
      },
      error_message: "営業担当者",
      status: "converted",
    });

    result.forEach((converted_spec) => {
      expect(converted_spec.status).toBe("converted");
      expect(converted_spec.internal_spec_id).toBeDefined();
      expect(converted_spec.spec_name).toBeDefined();
      expect(converted_spec.spec_type).toBeDefined();
      expect(converted_spec.requirements).toBeDefined();
      expect(Object.keys(converted_spec.requirements).length).toBeGreaterThan(0);
      expect(converted_spec.error_message).toBeDefined();
    });
  });
});