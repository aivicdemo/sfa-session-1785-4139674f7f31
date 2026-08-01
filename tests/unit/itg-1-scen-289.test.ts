import { determineSalesApproach } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-289
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 類似度スコアが業務基準値下限より低い場合、適用不可と判定される', () => {
    const business_rule_threshold = 0.70;
    const actual_similarity_score = 0.65;
    const sales_case_id = 'CASE-001';
    const customer_id = 'CUST-A123';
    const sales_stage = 'proposal';
    const product_category = 'enterprise_solution';

    const current_deal_info = {
      case_id: sales_case_id,
      customer_id: customer_id,
      stage: sales_stage,
      product_category: product_category,
      deal_amount: 5000000,
      contact_frequency: 3,
      days_since_first_contact: 45,
    };

    const success_pattern_matrix = {
      threshold_lower_bound: business_rule_threshold,
      patterns: [
        {
          pattern_id: 'PATTERN-SUC-001',
          customer_segment: 'enterprise',
          product_category: product_category,
          success_indicators: {
            min_contact_frequency: 2,
            avg_days_to_close: 60,
            proposal_success_rate: 0.75,
          },
          recommended_approach: 'executive_engagement',
          similarity_score: actual_similarity_score,
        },
      ],
    };

    const result = determineSalesApproach(
      current_deal_info,
      success_pattern_matrix,
      business_rule_threshold
    );

    expect(result.applicable).toBe(false);
    expect(result.determination).toBe('NOT_APPLICABLE');
    expect(result.similarity_score).toBe(0.65);
    expect(result.threshold_lower_bound).toBe(0.70);
    expect(result.reason).toMatch(/類似度スコア/);
    expect(result.reason).toMatch(/0\.65/);
    expect(result.reason).toMatch(/0\.70/);
  });
});