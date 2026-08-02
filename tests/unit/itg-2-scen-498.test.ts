import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-498
  test("重複候補が0件のとき、統合対象なしと判定される", () => {
    const inputCustomer = {
      customerId: "C001",
      customerName: "山田太郎",
      address: "東京都渋谷区",
    };

    const result = detectDuplicateCustomers(inputCustomer);

    expect(result.shouldMerge).toBe(false);
    expect(result.duplicateCandidates).toEqual([]);
  });
});