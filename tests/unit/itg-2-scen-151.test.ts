import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-151: [edge] 顧客データ重複検出・統合判定機能 - 定義された名寄せ基準ルール1件のとき、該当する重複候補が判定される
  test("定義されたルールに該当する重複候補が検出され、ルール外の顧客は除外される", () => {
    const normalization_rule = {
      rule_id: "rule_001",
      rule_name: "姓名完全一致 AND 電話番号完全一致",
      criteria: [
        {
          field: "full_name",
          match_type: "exact",
        },
        {
          field: "phone_number",
          match_type: "exact",
        },
      ],
      priority: 1,
    };

    const customers = [
      {
        customer_id: "cust_A",
        full_name: "田中太郎",
        phone_number: "090-1234-5678",
        email: "tanaka_a@example.com",
      },
      {
        customer_id: "cust_B",
        full_name: "田中太郎",
        phone_number: "090-1234-5678",
        email: "tanaka_b@example.com",
      },
      {
        customer_id: "cust_C",
        full_name: "田中花子",
        phone_number: "090-1234-5678",
        email: "tanaka_c@example.com",
      },
    ];

    const result = detectDuplicateCustomers(customers, [normalization_rule]);

    expect(result.duplicate_candidates.length).toBe(1);

    const duplicate_pair = result.duplicate_candidates[0];
    expect(duplicate_pair.customer_ids).toContain("cust_A");
    expect(duplicate_pair.customer_ids).toContain("cust_B");
    expect(duplicate_pair.customer_ids.length).toBe(2);

    expect(duplicate_pair.status).toBe("重複候補");
    expect(duplicate_pair.matched_rule_id).toBe("rule_001");

    const excluded_customer_in_duplicates = result.duplicate_candidates.some(
      (pair: { customer_ids: string[] }) =>
        pair.customer_ids.includes("cust_C")
    );
    expect(excluded_customer_in_duplicates).toBe(false);
  });
});