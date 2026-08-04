import { validateCustomerInfo } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-621: 企業規模が空文字列のとき、必須項目不足エラーを返す", () => {
    const input = {
      customerName: "テスト株式会社",
      industry: "製造業",
      companySize: "",
      dealStage: "提案中",
    };

    const result = validateCustomerInfo(input);

    expect(result.errorCode).toBe("VALIDATION_ERROR_REQUIRED_FIELD_MISSING");
    expect(result.errorMessage).toBe(
      "企業規模は必須項目です。空文字列では登録できません"
    );
    expect(result.httpStatusCode).toBe(400);
  });
});