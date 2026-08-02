import { calculateBudgetFitScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-721
  test('提案金額が0円のとき、予算適合スコア計算が適切に処理される', () => {
    const proposalAmount = 0;
    const customerBudget = 1000000;
    const budgetConstraint = {
      maxAmount: 2000000,
      minAmount: 100000,
    };

    const score = calculateBudgetFitScore(
      proposalAmount,
      customerBudget,
      budgetConstraint
    );

    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
    expect(score).toBe(0);
  });
});