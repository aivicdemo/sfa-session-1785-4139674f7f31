import { detectAndJudgeDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-460: 全ての属性が空文字列である場合、エラーが発生する", () => {
    const emptyCustomerData = {
      customerId: "",
      customerName: "",
      emailAddress: "",
      phoneNumber: "",
      address: "",
      companyName: "",
    };

    expect(() => detectAndJudgeDuplicateCustomers(emptyCustomerData)).toThrow(
      /INVALID_EMPTY_ATTRIBUTES/
    );
  });
});