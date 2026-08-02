import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1104
  test("すべての比較属性が空のとき、重複判定できないことが示される", () => {
    const input = {
      customerId: "CUST-001",
      name: "",
      email: "",
      phone: "",
      address: "",
    };

    const result = detectDuplicateCustomers(input);

    expect(result.status).toBe("CANNOT_JUDGE");
    expect(result.errorMessage).toBe(
      "重複判定に必要な比較属性が不足しています。少なくとも1つ以上の属性値を入力してください"
    );
    expect(result.isDuplicate).toBeUndefined();
  });
});