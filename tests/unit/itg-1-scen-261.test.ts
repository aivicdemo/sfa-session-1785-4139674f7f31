import { evaluateProposalApproachApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-261
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 成功パターンの購買金額上限が現在の顧客予算より高い場合、適用可能と判定される', () => {
    const success_pattern_id = 'SP-001';
    const purchase_amount_limit = 5000000;
    const current_customer_budget = 3000000;
    
    const result = evaluateProposalApproachApplicability({
      success_pattern_id: success_pattern_id,
      purchase_amount_limit: purchase_amount_limit,
      current_customer_budget: current_customer_budget,
    });
    
    expect(result.is_applicable).toBe(true);
    expect(result.target_success_pattern_id).toBe('SP-001');
  });
});