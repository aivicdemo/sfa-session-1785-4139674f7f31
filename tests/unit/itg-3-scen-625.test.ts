import { describe, test, expect } from "@jest/globals";
import { validateCustomerInfo } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠可視化機能 - 顧客情報入力検証", () => {
  test("SCEN-625: 顧客名が最大文字数を超えたとき、長さエラーを返す", () => {
    const customerNameExceedingLimit = "a".repeat(101);
    const inputData = {
      customer_name: customerNameExceedingLimit,
      industry: "IT",
      company_size: "large",
    };

    expect(() => validateCustomerInfo(inputData)).toThrow(
      /CUSTOMER_NAME_LENGTH_EXCEEDED/
    );
  });
});