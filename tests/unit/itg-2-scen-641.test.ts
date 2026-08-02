import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-641
  test("重複候補データの順序が逆の場合、同じ判定結果が返される", () => {
    const customerA = {
      customerId: "CUST001",
      customerName: "山田太郎",
      email: "yamada@example.com",
    };

    const customerB = {
      customerId: "CUST002",
      customerName: "太郎山田",
      email: "yamada.t@example.com",
    };

    const resultAB = detectDuplicateCustomers(customerA, customerB);
    const resultBA = detectDuplicateCustomers(customerB, customerA);

    expect(resultAB.duplicateScore).toBe(resultBA.duplicateScore);
    expect(resultAB.isDuplicate).toBe(resultBA.isDuplicate);
    expect(resultAB.mergeAction).toBe(resultBA.mergeAction);
  });
});