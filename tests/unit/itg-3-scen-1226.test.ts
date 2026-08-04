import { validateProposalAppropriatenessConfirmation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1226: [error] 提案妥当性確認判定機能 - 確認者ユーザー ID が空文字列のとき、エラーを返す
  test("確認者ユーザーIDが空文字列の場合、INVALID_REVIEWER_IDエラーを返す", () => {
    const proposalId = "proposal-001";
    const proposalContent = "顧客課題に対する提案内容";
    const reviewerUserId = "";
    const customerConstraints = {
      managementGoal: "経営目標の設定",
      budgetLimit: 1000000,
      scheduleConstraint: "2024-12-31"
    };

    expect(() =>
      validateProposalAppropriatenessConfirmation({
        proposalId,
        proposalContent,
        reviewerUserId,
        customerConstraints
      })
    ).toThrow(/確認者ユーザーID|reviewer|INVALID_REVIEWER_ID/i);
  });
});