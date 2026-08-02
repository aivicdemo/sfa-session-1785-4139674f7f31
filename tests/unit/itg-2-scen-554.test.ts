import { detectAndClassifyDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-554
  test("重複原因パターンの優先度が同じ複数パターンにマッチするとき、最初にマッチしたパターンで分類される", () => {
    const duplicate_reason_patterns = [
      {
        pattern_id: "P001",
        pattern_name: "姓名+生年月日",
        priority: 1,
        match_rules: [
          { field: "last_name", match_type: "exact" },
          { field: "first_name", match_type: "exact" },
          { field: "birth_date", match_type: "exact" },
        ],
      },
      {
        pattern_id: "P002",
        pattern_name: "電話番号+メールアドレス",
        priority: 1,
        match_rules: [
          { field: "phone_number", match_type: "exact" },
          { field: "email_address", match_type: "exact" },
        ],
      },
    ];

    const customer_x = {
      customer_id: "CUST001",
      last_name: "田中",
      first_name: "太郎",
      birth_date: "1990-05-15",
      phone_number: "09012345678",
      email_address: "tanaka.taro@example.com",
    };

    const customer_y = {
      customer_id: "CUST002",
      last_name: "田中",
      first_name: "太郎",
      birth_date: "1990-05-15",
      phone_number: "09012345678",
      email_address: "tanaka.taro@example.com",
    };

    const classification_result = detectAndClassifyDuplicateCustomers(
      [customer_x, customer_y],
      duplicate_reason_patterns
    );

    expect(classification_result.is_duplicate).toBe(true);
    expect(classification_result.matched_pattern_id).toBe("P001");
    expect(classification_result.matched_pattern_name).toBe("姓名+生年月日");
    expect(classification_result.customer_pair).toEqual([
      customer_x.customer_id,
      customer_y.customer_id,
    ]);
  });
});