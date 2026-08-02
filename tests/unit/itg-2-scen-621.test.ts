import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-621
  test("メールアドレスが空値の場合、重複判定対象外となる", () => {
    const customerA = {
      customer_id: "CUST-001",
      email: null,
      name: "山田太郎",
      phone: "09012345678",
      address: "東京都渋谷区",
      created_at: "2024-01-01T00:00:00Z"
    };

    const customerB = {
      customer_id: "CUST-002",
      email: null,
      name: "山田太郎",
      phone: "09012345678",
      address: "東京都渋谷区",
      created_at: "2024-01-02T00:00:00Z"
    };

    const result = detectDuplicateCustomers([customerA], customerB);

    expect(result).toEqual({
      is_duplicate: true,
      duplicate_score: 1.0,
      matched_fields: ["name", "phone"],
      excluded_fields: ["email"],
      field_judgments: {
        email: {
          status: "excluded",
          match: null,
          reason: "empty_value"
        },
        name: {
          status: "matched",
          match: true
        },
        phone: {
          status: "matched",
          match: true
        }
      },
      confidence_level: "high",
      consolidation_candidate_id: "CUST-001"
    });
  });
});