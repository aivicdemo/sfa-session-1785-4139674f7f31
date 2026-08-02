import { validateProposalRecord } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 提案・顧客対応記録の必須項目検証", () => {
  // SCEN-999
  test("提案内容が空の場合に入力が受け付けられず警告が表示される", () => {
    const input = {
      customerName: "株式会社テスト",
      contactDateTime: new Date("2024-01-15T14:30:00Z"),
      proposalContent: "",
      notes: "フォローアップ予定",
    };

    const result = validateProposalRecord(input);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toEqual({
      field: "proposalContent",
      message: "提案内容は必須項目です。入力してください。",
    });
    expect(result.focusField).toBe("proposalContent");
    expect(result.isSubmitDisabled).toBe(true);
  });
});