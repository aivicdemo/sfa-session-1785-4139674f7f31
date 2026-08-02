import { calculateProposalFitScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-724: 提案資料と顧客ニーズの適合度スコア化機能 - 予算適合度がちょうど許容範囲内', () => {
    const proposal_amount = 1000000;
    const customer_budget_limit = 1100000;
    const budget_tolerance_percent = 10;

    const result = calculateProposalFitScore({
      proposal_amount,
      customer_budget_limit,
      budget_tolerance_percent,
    });

    expect(result.budget_fit_score).toBeGreaterThanOrEqual(80);
    expect(result.budget_fit_score).toBeLessThanOrEqual(100);
    expect(result.budget_fit_status).toBe('acceptable');
  });
});