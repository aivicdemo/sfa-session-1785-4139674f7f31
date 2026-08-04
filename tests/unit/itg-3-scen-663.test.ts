import { validateCustomerInfo } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-663
  test("企業規模にのみ形式エラーがあるとき、企業規模のみ修正を促す", () => {
    const input = {
      company_name: "株式会社テスト",
      industry: "製造業",
      company_size: "999",
      employee_count: "500"
    };

    const result = validateCustomerInfo(input);

    expect(result.is_valid).toBe(false);
    expect(result.errors).toEqual({
      company_name: null,
      industry: null,
      company_size: "企業規模は【従業員規模の標準形式】で入力してください",
      employee_count: null
    });
    expect(result.highlighted_fields).toEqual(["company_size"]);
    expect(result.form_submitted).toBe(false);
  });
});