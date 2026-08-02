import { normalizeCustomerData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-867
  test("正規化対象の顧客データが複数件のとき、全件が正規化される", () => {
    const input_customers = [
      {
        customer_id: "cust_001",
        name: "山田　太郎",
        phone_number: "090-1234-5678",
        postal_code: "123-4567",
      },
      {
        customer_id: "cust_002",
        name: "佐藤 花子",
        phone_number: "09087654321",
        postal_code: "9876543",
      },
      {
        customer_id: "cust_003",
        name: "鈴木　　次郎",
        phone_number: "080 9876 5432",
        postal_code: "555-6789",
      },
    ];

    const result = normalizeCustomerData(input_customers);

    expect(result.length).toBe(3);
    expect(result[0]).toEqual({
      customer_id: "cust_001",
      name: "山田太郎",
      phone_number: "09012345678",
      postal_code: "1234567",
    });
    expect(result[1]).toEqual({
      customer_id: "cust_002",
      name: "佐藤花子",
      phone_number: "09087654321",
      postal_code: "9876543",
    });
    expect(result[2]).toEqual({
      customer_id: "cust_003",
      name: "鈴木次郎",
      phone_number: "08098765432",
      postal_code: "5556789",
    });
  });
});