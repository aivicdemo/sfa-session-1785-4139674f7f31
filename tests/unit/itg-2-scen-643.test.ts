import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-643
  test("重複判定の必須入力項目が欠落している場合、エラーが発生する", () => {
    const input = {
      customerId: "CUST001",
      customerName: null,
      emailAddress: "test@example.com",
    };

    expect(() => detectDuplicateCustomers(input)).toThrow(/顧客名/);
  });
});