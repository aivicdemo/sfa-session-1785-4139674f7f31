import { evaluateDetectionResultSeverity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-819: 問題検出結果の重要度・根拠・対応必要性判定が冪等性を満たす', () => {
    const detection_result = {
      detection_id: 'det_202401_001',
      sales_rep_id: 'rep_12345',
      detection_type: 'monthly_sales_target_unmet',
      detected_value: 70,
      threshold: 100,
      detection_timestamp: '2024-01-31T23:59:59Z',
      affected_period: '2024-01',
      customer_count: 8,
      proposal_count: 12,
      conversion_count: 2,
    };

    const first_evaluation = evaluateDetectionResultSeverity(detection_result);

    const expected_severity_first = 'high';
    const expected_rationale_first = '目標比達成率70%未満';
    const expected_requires_action_first = true;

    expect(first_evaluation.severity).toBe(expected_severity_first);
    expect(first_evaluation.rationale).toBe(expected_rationale_first);
    expect(first_evaluation.requires_action).toBe(expected_requires_action_first);

    const second_evaluation = evaluateDetectionResultSeverity(detection_result);

    const expected_severity_second = 'high';
    const expected_rationale_second = '目標比達成率70%未満';
    const expected_requires_action_second = true;

    expect(second_evaluation.severity).toBe(expected_severity_second);
    expect(second_evaluation.rationale).toBe(expected_rationale_second);
    expect(second_evaluation.requires_action).toBe(expected_requires_action_second);

    expect(first_evaluation.severity).toBe(second_evaluation.severity);
    expect(first_evaluation.rationale).toBe(second_evaluation.rationale);
    expect(first_evaluation.requires_action).toBe(second_evaluation.requires_action);
  });
});