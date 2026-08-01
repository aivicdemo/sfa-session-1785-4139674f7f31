import { matchSuccessPatternMatrix } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-269
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 導入期間と購買タイミングの検討期間が完全に一致する場合、適用可能と判定される', () => {
    const success_pattern_id = 'sp_20240415_001';
    const success_pattern_matrix = [
      {
        id: success_pattern_id,
        introduction_start_date: '2024-04-01',
        introduction_end_date: '2024-06-30',
        customer_attribute: 'mid_market',
        product_category: 'enterprise_solution',
        proposal_content: 'comprehensive_digital_transformation',
        contract_success_flag: true
      }
    ];

    const customer_purchase_timing = {
      planned_purchase_date: '2024-05-15',
      consideration_period_start: '2024-04-01',
      consideration_period_end: '2024-06-30',
      customer_segment: 'mid_market',
      target_product: 'enterprise_solution'
    };

    const result = matchSuccessPatternMatrix(
      success_pattern_matrix,
      customer_purchase_timing
    );

    expect(result.status).toBe('APPLICABLE');
    expect(result.matched_pattern_id).toBe(success_pattern_id);
    expect(result.match_reason).toBe('導入期間と購買タイミングの検討期間が完全に一致');
    expect(result.matched_pattern_id).toBeDefined();
    expect(typeof result.match_confidence_score).toBe('number');
    expect(result.match_confidence_score).toBeGreaterThanOrEqual(0);
    expect(result.match_confidence_score).toBeLessThanOrEqual(100);
  });
});