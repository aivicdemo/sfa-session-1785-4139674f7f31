import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-454
  test("顧客名のみ一致し他の属性は全て異なる場合、重複と判定されない", () => {
    const customerA = {
      customer_id: "CUST001",
      customer_name: "山田太郎",
      phone_number: "090-1234-5678",
      email_address: "yamada@example.com",
      address: "東京都渋谷区",
    };

    const customerB = {
      customer_id: "CUST002",
      customer_name: "山田太郎",
      phone_number: "090-9999-9999",
      email_address: "other@example.com",
      address: "大阪府大阪市",
    };

    const result = detectDuplicateCustomers(customerA, customerB);

    expect(result).toBe(false);
  });
});