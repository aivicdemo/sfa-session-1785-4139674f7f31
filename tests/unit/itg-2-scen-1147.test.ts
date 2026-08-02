import { detectAndUnifyDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1147
  test("重複判定の適用対象データが更新された場合、判定結果が再計算される", () => {
    const initial_cust_a = {
      customer_id: "CUST001",
      customer_name: "山田太郎",
      email: "yamada@example.com",
      last_updated: "2024-01-15T10:00:00Z",
    };

    const initial_cust_b = {
      customer_id: "CUST002",
      customer_name: "山田太郎",
      email: "yamada.t@example.com",
      last_updated: "2024-01-15T10:00:00Z",
    };

    const duplicate_rule = {
      rule_id: "RULE001",
      rule_name: "名前完全一致+メールドメイン一致",
      conditions: [
        {
          field: "customer_name",
          operator: "exact_match",
          weight: 0.5,
        },
        {
          field: "email_domain",
          operator: "exact_match",
          weight: 0.35,
        },
      ],
      threshold_score: 0.8,
    };

    const initial_result = detectAndUnifyDuplicateCustomers(
      [initial_cust_a, initial_cust_b],
      duplicate_rule
    );

    expect(initial_result.duplicate_status).toBe("重複候補");
    expect(initial_result.duplicate_score).toBeGreaterThanOrEqual(0.85);
    expect(initial_result.judgment_reason).toContain("名前が完全一致");

    const updated_cust_b = {
      customer_id: "CUST002",
      customer_name: "山田太郎",
      email: "yamada@example.com",
      last_updated: "2024-01-15T11:30:00Z",
    };

    const updated_result = detectAndUnifyDuplicateCustomers(
      [initial_cust_a, updated_cust_b],
      duplicate_rule
    );

    expect(updated_result.duplicate_status).toBe("確定重複");
    expect(updated_result.duplicate_score).toBeGreaterThanOrEqual(0.95);
    expect(updated_result.judgment_reason).toContain("メールアドレスが完全一致");
  });
});