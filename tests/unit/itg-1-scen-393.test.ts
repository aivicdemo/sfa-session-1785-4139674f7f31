import { determineSuccessPatternApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-393
  test('成功パターンマトリクス適用判定機能 - 顧客の購買予算が成功パターンの推奨予算下限を下回るとき適用除外となる', () => {
    const success_pattern_matrix = {
      pattern_id: 'pat_001',
      recommended_budget_min: 500000,
      recommended_budget_max: 2000000,
      customer_attributes: {
        industry: 'IT',
        company_size: 'large'
      },
      success_rate: 0.75
    };

    const customer_data = {
      customer_id: 'cust_001',
      purchase_budget: 400000,
      industry: 'IT',
      company_size: 'large'
    };

    const result = determineSuccessPatternApplicability(
      success_pattern_matrix,
      customer_data
    );

    expect(result.is_applicable).toBe(false);
    expect(result.exclusion_reason).toBe('購買予算が推奨予算下限（500000円）を下回るため');
  });
});