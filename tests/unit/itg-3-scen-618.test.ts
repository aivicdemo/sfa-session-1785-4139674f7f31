import { validateCustomerInfo } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-618: 顧客情報入力検証機能 - 企業規模が空のとき、必須項目不足エラーを返す", () => {
    const customerInfo = {
      name: "山田太郎",
      email: "yamada@example.com",
      industry: "製造業",
      companySize: "",
    };

    expect(() => validateCustomerInfo(customerInfo)).toThrow(/企業規模/);
  });
});