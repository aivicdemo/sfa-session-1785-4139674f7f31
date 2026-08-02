import { calculateProposalNeedsCompatibilityScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-720
  test('提案資料と顧客ニーズの適合度スコア化機能 - 顧客予算制約が0円のとき、予算適合スコア計算が適切に処理される', () => {
    const customer_needs = {
      customer_id: 'CUST001',
      budget_constraint_yen: 0,
      business_category: '製造業',
      company_scale: '中堅企業',
      required_features: ['在庫管理', 'レポート機能'],
    };

    const proposal_document = {
      proposal_id: 'PROP001',
      estimated_budget_yen: 1000000,
      proposed_features: ['在庫管理', 'レポート機能', 'API連携'],
      customer_id: 'CUST001',
    };

    const result = calculateProposalNeedsCompatibilityScore(
      customer_needs,
      proposal_document
    );

    expect(result.budget_compatibility_score).toBe(0);
    expect(result.overall_compatibility_status).toBe('不適合');
    expect(result.calculation_error).toBeUndefined();
  });
});