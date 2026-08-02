import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-262
  test("顧客データ重複検出機能 - データ品質ルールが1件のとき、1つのルールで品質検証が実行される", () => {
    const qualityRules = [
      {
        rule_id: "rule_001",
        rule_name: "完全一致重複検出",
        rule_type: "duplicate_detection",
        condition: {
          fields: ["customer_name", "address"],
          match_type: "exact_match",
        },
        is_active: true,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
    ];

    const customerData = [
      {
        customer_id: "cust_001",
        customer_name: "株式会社ABC",
        address: "東京都渋谷区1-1-1",
        email: "contact@abc.com",
        phone: "03-1234-5678",
      },
      {
        customer_id: "cust_002",
        customer_name: "株式会社ABC",
        address: "東京都渋谷区1-1-1",
        email: "info@abc.com",
        phone: "03-1234-5679",
      },
      {
        customer_id: "cust_003",
        customer_name: "株式会社XYZ",
        address: "東京都新宿区2-2-2",
        email: "contact@xyz.com",
        phone: "03-9876-5432",
      },
    ];

    const result = detectDuplicateCustomers(customerData, qualityRules);

    expect(result.rules_applied_count).toBe(1);
    expect(result.duplicate_groups.length).toBe(1);
    expect(result.duplicate_groups[0].duplicate_customer_ids).toContain(
      "cust_001"
    );
    expect(result.duplicate_groups[0].duplicate_customer_ids).toContain(
      "cust_002"
    );
    expect(result.duplicate_groups[0].matching_rule_id).toBe("rule_001");
  });
});