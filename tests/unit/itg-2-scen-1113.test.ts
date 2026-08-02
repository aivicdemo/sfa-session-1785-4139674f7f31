import { validateCaseDataEmailFormat } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - メールアドレス形式検証", () => {
  // SCEN-1113
  test("事例データのメールアドレス形式が不正である場合、形式検証に不合格となる", () => {
    const invalid_email_cases = [
      "user@domain",
      "user@.com",
      "user domain@example.com",
    ];

    const validation_result = validateCaseDataEmailFormat({
      email_addresses: invalid_email_cases,
    });

    expect(validation_result.status).toBe("FAILED");
    expect(validation_result.error_code).toBe("INVALID_EMAIL_FORMAT");
    expect(validation_result.error_message).toMatch(/メールアドレスの形式が正しくありません/);
    expect(validation_result.invalid_emails).toEqual(invalid_email_cases);
  });
});