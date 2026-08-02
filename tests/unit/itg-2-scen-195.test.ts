import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-195
  test("顧客名が完全一致するとき、重複判定スコアが満点となる", () => {
    const customerA = {
      customer_id: "cust_001",
      customer_name: "田中太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5678",
    };

    const customerB = {
      customer_id: "cust_002",
      customer_name: "田中太郎",
      address: "大阪府大阪市",
      phone: "090-9876-5432",
    };

    const result = detectDuplicateCustomers(customerA, customerB);

    expect(result.duplicate_score).toBe(100);
  });
});