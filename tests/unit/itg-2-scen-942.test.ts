import { validateProposal } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-942
  test("[error] 提案内容検証機能 - 提案日付が過去日のとき検証エラーが返される", () => {
    const today = new Date("2024-01-15T00:00:00Z");
    const yesterday = new Date("2024-01-14T00:00:00Z");

    const proposal = {
      customerId: "CUST-001",
      customerName: "テスト顧客",
      proposalDate: yesterday,
      amount: 100000,
      content: "提案内容",
    };

    const result = validateProposal(proposal, today);

    expect(result).toEqual({
      isValid: false,
      errorCode: "PROPOSAL_DATE_PAST_ERROR",
      errorMessage: "提案日付は本日以降の日付を指定してください",
    });
  });
});