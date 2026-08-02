import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-859
  test("電話番号が欠けているとき、処理は失敗する", () => {
    const inputCustomer = {
      name: "田中太郎",
      email: "tanaka@example.com",
      phoneNumber: undefined,
    };

    expect(() => detectDuplicateCustomers(inputCustomer)).toThrow(
      /phoneNumber/
    );
  });
});