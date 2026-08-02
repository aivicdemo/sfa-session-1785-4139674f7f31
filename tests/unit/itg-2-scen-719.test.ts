import { calculateProposalNeedsAlignmentScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-719
  test('提案資料と顧客ニーズの適合度スコア化機能 - 顧客予算制約が提案金額に対して余裕があり、予算適合スコアが中間値になる', () => {
    const customer_budget = 5000000;
    const proposal_amount = 3000000;

    const result = calculateProposalNeedsAlignmentScore({
      customer_budget,
      proposal_amount,
    });

    expect(result.budget_alignment_score).toBeGreaterThanOrEqual(50);
    expect(result.budget_alignment_score).toBeLessThanOrEqual(70);
    expect(result.budget_alignment_score).toBe(60);
    expect(result.budget_margin_rate).toBe(0.4);
  });
});