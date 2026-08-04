import { validateCustomerIndustry } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能 - 顧客情報入力検証", () => {
  test("SCEN-623: 業種が定義済み選択肢に含まれない場合、形式エラーを返す", () => {
    const invalidIndustry = "金融テック";
    const allowedIndustries = ["情報通信", "製造", "金融", "小売", "その他"];

    const result = validateCustomerIndustry(invalidIndustry, allowedIndustries);

    expect(result.statusCode).toBe(400);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toMatch(/業種は定義された選択肢から選択してください/);
  });
});