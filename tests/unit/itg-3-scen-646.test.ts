import { validateCustomerInput } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-646: [edge] 顧客情報入力検証機能 - 企業規模が空文字列のとき、該当項目の修正を促す
  test("企業規模が空文字列のとき、検証エラーを返して修正を促す", () => {
    const input = {
      companyName: "サンプル企業",
      industry: "IT",
      companySize: "",
    };

    const result = validateCustomerInput(input);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: "companySize",
      errorCode: "REQUIRED_FIELD",
      message: "企業規模は必須項目です。入力してください。",
    });
    expect(result.invalidFields).toContain("companySize");
  });
});