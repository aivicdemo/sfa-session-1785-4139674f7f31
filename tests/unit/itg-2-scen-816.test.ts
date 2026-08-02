import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-816
  test("データ品質ルール定義が欠落している場合、検証がエラーになる", () => {
    const customerRecord = {
      customerId: "C001",
      customerName: "山田太郎",
    };

    const emptyRuleSet = null;

    expect(() =>
      detectDuplicateCustomers(customerRecord, emptyRuleSet)
    ).toThrow(/データ品質ルール定義/);
  });
});