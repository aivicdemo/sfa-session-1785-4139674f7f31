import { validateCustomerInfo } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-622: 顧客名の形式が不正なとき、形式エラーを返す", () => {
    const invalidCustomerNames = [
      "顧客@名!",
      "123",
      "<script>",
      "",
      "customer#123",
      "顧客\nname",
      "   ",
      "customer<>name",
    ];

    invalidCustomerNames.forEach((invalidName) => {
      const input = {
        customerName: invalidName,
        industry: "IT",
        companySize: "medium",
      };

      const result = validateCustomerInfo(input);

      expect(result.statusCode).toBe(400);
      expect(result.errorCode).toBe("INVALID_CUSTOMER_NAME_FORMAT");
      expect(result.message).toBe(
        "顧客名は日本語または英数字のみで構成され、特殊文字・スクリプトを含まないこと。また空文字列は許可されません"
      );
      expect(result.isSaved).toBe(false);
    });
  });
});