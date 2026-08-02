import { calcProposalNeedsCompatibilityScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-723
  test('[edge] 提案資料と顧客ニーズの適合度スコア化機能 - 提案金額が空のとき、予算適合スコア計算が適切に処理される', () => {
    const proposal_amount = null;
    const customer_budget_limit = 1000000;

    const result = calcProposalNeedsCompatibilityScore({
      proposal_amount,
      customer_budget_limit,
    });

    expect(result.budget_compatibility_score).toBe(0);
    expect(result.error_flag).toEqual({
      has_error: true,
      error_message: '提案金額が未入力です',
    });
    expect(result.should_continue_judgment).toBe(false);
  });
});