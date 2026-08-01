import { evaluateSuccessPatternApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-262
  test('[normal] 成功パターンマトリクス参照による提案アプローチ判定機能 - 成功パターンの購買金額上限が現在の顧客予算より低い場合、適用不可と判定される', () => {
    const success_pattern = {
      pattern_id: 'pattern_001',
      purchase_limit_amount: 5000000,
      customer_segment: 'enterprise',
      product_category: 'solution_a',
    };

    const customer = {
      customer_id: 'cust_001',
      current_budget: 6000000,
      segment: 'enterprise',
      required_product: 'solution_a',
    };

    const result = evaluateSuccessPatternApplicability(success_pattern, customer);

    expect(result.is_applicable).toBe(false);
    expect(result.reason).toMatch(/購買金額上限/);
    expect(result.reason).toMatch(/500/);
    expect(result.reason).toMatch(/600/);
    expect(result.reason).toMatch(/適用不可/);
  });
});