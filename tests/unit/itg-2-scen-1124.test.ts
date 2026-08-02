import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1124
  test("2つの顧客データが完全に異なる場合、重複判定が検出されない", () => {
    const customer_a = {
      customer_id: "CUST-001",
      name: "山田太郎",
      email: "yamada@example.com",
      address: "東京都渋谷区",
      phone: "090-1111-1111",
    };

    const customer_b = {
      customer_id: "CUST-999",
      name: "佐藤花子",
      email: "sato@example.com",
      address: "大阪府大阪市",
      phone: "090-2222-2222",
    };

    const result = detectDuplicateCustomers(customer_a, customer_b);

    expect(result.is_duplicate).toBe(false);
    expect(result.duplicate_score).toBeLessThanOrEqual(0.0);
    expect(result.judgment_reason).toBe(
      "顧客ID、名前、メールアドレス、住所、電話番号のいずれも一致していない"
    );
  });
});