import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-853
  test("重複候補顧客が0件のとき、重複検出結果が空結果で返される", () => {
    const single_customer_dataset = [
      {
        customer_id: "CUST-001",
        customer_name: "株式会社テスト",
        postal_code: "100-0001",
        address: "東京都千代田区丸の内",
        phone: "03-1234-5678",
        email: "contact@test.co.jp",
        industry: "情報通信業",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
    ];

    const result = detectDuplicateCustomers(single_customer_dataset);

    expect(result.duplicate_candidates).toEqual([]);
    expect(result.duplicate_count).toBe(0);
    expect(result.status_code).toBe(200);
    expect(result.error_message).toBeNull();
  });
});