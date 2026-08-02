import { calculateProposalNeedsCompatibilityScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-726
  test('提案資料と顧客ニーズの適合度スコア化機能 - 予算適合度が許容範囲内超過で、スコアが許容範囲外スコアになる', () => {
    const proposal_budget_limit = 1000000;
    const customer_needs_budget = 1050000;
    const budget_tolerance_rate = 0.05;

    const budget_excess_rate = (customer_needs_budget - proposal_budget_limit) / proposal_budget_limit;
    const is_within_tolerance = Math.abs(budget_excess_rate) <= budget_tolerance_rate;
    const tolerance_exceeded_by_rate = Math.abs(budget_excess_rate) - budget_tolerance_rate;

    const score = calculateProposalNeedsCompatibilityScore({
      proposal_budget_limit: proposal_budget_limit,
      customer_needs_budget: customer_needs_budget,
      budget_tolerance_rate: budget_tolerance_rate,
    });

    expect(is_within_tolerance).toBe(false);
    expect(tolerance_exceeded_by_rate).toBeGreaterThan(0);
    expect(score).toBeLessThan(80);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});