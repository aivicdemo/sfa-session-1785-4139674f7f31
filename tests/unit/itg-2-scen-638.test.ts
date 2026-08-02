import { mergeCustomerRecords } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-638
  test("統合後データで複数の値が存在する項目は、より新しい更新日時の値が優先される", () => {
    const recordA = {
      customer_id: "CUST001",
      phone_number: "090-1234-5678",
      updated_at: new Date("2024-01-15T10:00:00Z"),
    };

    const recordB = {
      customer_id: "CUST001",
      phone_number: "090-9999-9999",
      updated_at: new Date("2024-01-20T14:30:00Z"),
    };

    const merged_record = mergeCustomerRecords(recordA, recordB);

    expect(merged_record.phone_number).toBe("090-9999-9999");
  });
});