import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-380
  test("同一顧客名かつ同一電話番号の顧客が複数組の場合、全組が重複候補として返される", () => {
    const customerRecords = [
      {
        customer_id: "CUST-001",
        customer_name: "山田太郎",
        phone_number: "090-1234-5678",
        email: "yamada1@example.com",
      },
      {
        customer_id: "CUST-002",
        customer_name: "山田太郎",
        phone_number: "090-1234-5678",
        email: "yamada2@example.com",
      },
      {
        customer_id: "CUST-003",
        customer_name: "山田太郎",
        phone_number: "090-1234-5678",
        email: "yamada3@example.com",
      },
      {
        customer_id: "CUST-004",
        customer_name: "山田太郎",
        phone_number: "090-1234-5678",
        email: "yamada4@example.com",
      },
    ];

    const result = detectDuplicateCustomers(customerRecords);

    expect(result.duplicate_candidates).toHaveLength(4);
    expect(result.duplicate_candidates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          customer_id: "CUST-001",
          customer_name: "山田太郎",
          phone_number: "090-1234-5678",
          duplicate_type: "name_and_phone_match",
        }),
        expect.objectContaining({
          customer_id: "CUST-002",
          customer_name: "山田太郎",
          phone_number: "090-1234-5678",
          duplicate_type: "name_and_phone_match",
        }),
        expect.objectContaining({
          customer_id: "CUST-003",
          customer_name: "山田太郎",
          phone_number: "090-1234-5678",
          duplicate_type: "name_and_phone_match",
        }),
        expect.objectContaining({
          customer_id: "CUST-004",
          customer_name: "山田太郎",
          phone_number: "090-1234-5678",
          duplicate_type: "name_and_phone_match",
        }),
      ])
    );

    result.duplicate_candidates.forEach((candidate) => {
      expect(candidate.duplicate_type).toBe("name_and_phone_match");
    });
  });
});