import { validateCustomerInfo } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-619: 顧客名が空文字列のとき、必須項目不足エラーを返す", () => {
    const input = {
      customerId: "CUST-001",
      customerName: "",
      industry: "製造業",
      dealAmount: 5000000,
    };

    const result = validateCustomerInfo(input);

    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe("REQUIRED_FIELD_MISSING");
    expect(result.errorMessage).toBe("顧客名は必須項目です");
    expect(result.fieldName).toBe("customerName");
  });
});