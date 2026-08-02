import { detectDuplicateCustomersWithNormalization } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-462
  test("[edge] 顧客データ重複検出と統合判定 - 正規化ルールが1件の場合、そのルールが適用される", () => {
    const normalizationRules = [
      {
        rule_id: "NORM-001",
        rule_name: "電話番号ハイフン除去",
        target_field: "phone",
        normalization_type: "remove_hyphen",
        pattern: "-",
        replacement: "",
        priority: 1,
        is_active: true,
      },
    ];

    const customerData = [
      {
        customer_id: "CUST-001",
        customer_name: "山田太郎",
        phone: "090-1234-5678",
      },
      {
        customer_id: "CUST-002",
        customer_name: "山田太郎",
        phone: "09012345678",
      },
      {
        customer_id: "CUST-003",
        customer_name: "鈴木花子",
        phone: "080-9876-5432",
      },
    ];

    const result = detectDuplicateCustomersWithNormalization({
      customer_data: customerData,
      normalization_rules: normalizationRules,
      duplicate_detection_threshold: 0.85,
    });

    expect(result.applied_rules_count).toBe(1);
    expect(result.applied_rules).toEqual([
      {
        rule_id: "NORM-001",
        rule_name: "電話番号ハイフン除去",
      },
    ]);
    expect(result.duplicate_groups).toHaveLength(1);
    expect(result.duplicate_groups[0]).toEqual({
      group_id: expect.any(String),
      customer_ids: expect.arrayContaining(["CUST-001", "CUST-002"]),
      duplicate_reason: "phone",
      normalized_value: "09012345678",
      confidence_score: expect.any(Number),
    });
    expect(result.normalization_execution_log).toContain("適用ルール数:1");
    expect(result.non_duplicate_customers).toEqual(["CUST-003"]);
  });
});