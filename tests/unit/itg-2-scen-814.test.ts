import { detectDuplicateAndMismatch } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-814
  test("住所が空文字列の場合、その項目は検出ロジックからスキップされる", () => {
    const recordA = {
      customer_id: "CUST001",
      customer_name: "山田太郎",
      phone_number: "09012345678",
      email: "yamada@example.com",
      address: "",
      created_at: "2024-01-15T10:00:00Z",
    };

    const recordB = {
      customer_id: "CUST002",
      customer_name: "鈴木花子",
      phone_number: "09087654321",
      email: "suzuki@example.com",
      address: "",
      created_at: "2024-01-15T10:30:00Z",
    };

    const result = detectDuplicateAndMismatch([recordA, recordB]);

    expect(result.is_duplicate).toBe(false);
    expect(result.skipped_fields).toContain("address");
    expect(result.mismatch_details).toEqual(
      expect.objectContaining({
        customer_name: true,
        phone_number: true,
        email: true,
        address: false,
      })
    );
  });
});