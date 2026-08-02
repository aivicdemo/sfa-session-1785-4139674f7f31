import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-615
  test("顧客名完全一致で同一顧客と判定される", () => {
    const existing_customer = {
      customer_id: "CUST001",
      customer_name: "株式会社テスト太郎",
      postal_code: "100-0001",
      address: "東京都千代田区丸の内1-1-1",
      phone_number: "03-1234-5678",
      industry: "製造業",
      representative_name: "山田太郎",
      created_at: new Date("2024-01-15T10:00:00Z"),
    };

    const new_customer = {
      customer_id: "CUST002",
      customer_name: "株式会社テスト太郎",
      postal_code: "100-0002",
      address: "東京都千代田区丸の内1-1-2",
      phone_number: "090-9876-5432",
      industry: "サービス業",
      representative_name: "鈴木次郎",
      created_at: new Date("2024-01-20T14:30:00Z"),
    };

    const result = detectDuplicateCustomers(existing_customer, new_customer);

    expect(result.duplicate).toBe(true);
    expect(result.match_type).toBe("EXACT_NAME_MATCH");
    expect(result.confidence_score).toBe(100);
    expect(result.merge_recommended).toBe(true);
    expect(result.recommended_action).toBe("MERGE_RECOMMENDED");
  });
});