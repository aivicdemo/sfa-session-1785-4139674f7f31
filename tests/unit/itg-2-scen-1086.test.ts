import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1086
  test("顧客名が完全一致するが他属性が不一致のとき、重複ではないと判定される", () => {
    const customerA = {
      id: "cust_001",
      name: "山田太郎",
      phone: "090-1234-5678",
      address: "東京都渋谷区",
    };

    const customerB = {
      id: "cust_002",
      name: "山田太郎",
      phone: "090-9999-9999",
      address: "大阪府大阪市",
    };

    const result = detectDuplicateCustomers(customerA, customerB);

    expect(result.isDuplicate).toBe(false);
    expect(result.reason).toContain("顧客名は一致するが電話番号および住所が異なるため同一顧客ではない");
  });
});