import { normalizeCustomerData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-872
  test("正規化対象の住所が空のとき、処理は失敗する", () => {
    const customer_data = {
      customer_id: "CUST001",
      customer_name: "山田太郎",
      address: "",
      phone_number: "09012345678",
      email: "yamada@example.com",
    };

    expect(() => normalizeCustomerData(customer_data)).toThrow(/住所/);
  });
});