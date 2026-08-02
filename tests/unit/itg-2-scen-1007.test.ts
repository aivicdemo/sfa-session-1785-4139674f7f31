import { validateProposalRecord } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1007
  test("提案・顧客対応記録の必須項目検証 - 必須項目が空白スペースのみの場合に入力が受け付けられず警告が表示される", () => {
    const input = {
      customer_name: "　　",
      response_content: "　　",
      response_datetime: "　　",
    };

    const result = validateProposalRecord(input);

    expect(result.is_valid).toBe(false);
    expect(result.errors).toEqual([
      "顧客名は空白のみでは入力できません",
      "対応内容は空白のみでは入力できません",
      "対応日時は空白のみでは入力できません",
    ]);
    expect(result.record_saved).toBe(false);
  });
});