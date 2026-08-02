import { calculateProposalNeedsAlignmentScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-717
  test("[normal] 提案資料と顧客ニーズの適合度スコア化機能 - 顧客予算制約が提案金額以上で、予算適合スコアが最高値になる", () => {
    const customer_budget = 1000000;
    const proposal_amount = 800000;

    const result = calculateProposalNeedsAlignmentScore({
      customer_budget,
      proposal_amount,
    });

    expect(result.budget_alignment_score).toBe(100);
  });
});