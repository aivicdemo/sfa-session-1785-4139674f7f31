import { determineSuccessPatternApplicability } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-405
  test('成約率が閾値を超過した場合、そのパターンが適用可能と判定される', () => {
    const success_rate_threshold = 80;
    const test_pattern_success_rate = 81;
    const test_pattern = {
      pattern_id: 'pattern_001',
      success_rate: test_pattern_success_rate,
      sample_count: 100,
      customer_attributes: ['enterprise', 'high_value'],
      sales_stage: 'proposal',
      action_type: 'follow_up_call',
    };

    const result = determineSuccessPatternApplicability(
      test_pattern,
      success_rate_threshold
    );

    expect(result.is_applicable).toBe(true);
    expect(result.applicability_status).toBe('APPLICABLE');
  });
});