import { evaluateSalesRepImprovementTarget } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-170
  test('営業担当者の行動パターン分析結果が複数件の場合、全担当者に対して改善指導判定が実行される', () => {
    const analysisResults = [
      {
        sales_rep_id: 'A001',
        analysis_date: '2024-01-15',
        behavior_pattern_classification: 'high_frequency_contact',
        improvement_target_flag: 'not_judged',
      },
      {
        sales_rep_id: 'B002',
        analysis_date: '2024-01-15',
        behavior_pattern_classification: 'low_proposal_success_rate',
        improvement_target_flag: 'not_judged',
      },
      {
        sales_rep_id: 'C003',
        analysis_date: '2024-01-15',
        behavior_pattern_classification: 'insufficient_followup',
        improvement_target_flag: 'not_judged',
      },
    ];

    const judgmentTimestamp = '2024-01-15T09:30:00Z';

    const result = evaluateSalesRepImprovementTarget(analysisResults, judgmentTimestamp);

    expect(result.judged_records).toBe(3);
    expect(result.results).toHaveLength(3);

    expect(result.results[0]).toEqual({
      sales_rep_id: 'A001',
      analysis_date: '2024-01-15',
      behavior_pattern_classification: 'high_frequency_contact',
      improvement_target_flag: 'judged',
      judgment_result: 'non_target',
      judgment_timestamp: '2024-01-15T09:30:00Z',
    });

    expect(result.results[1]).toEqual({
      sales_rep_id: 'B002',
      analysis_date: '2024-01-15',
      behavior_pattern_classification: 'low_proposal_success_rate',
      improvement_target_flag: 'judged',
      judgment_result: 'target',
      judgment_timestamp: '2024-01-15T09:30:00Z',
    });

    expect(result.results[2]).toEqual({
      sales_rep_id: 'C003',
      analysis_date: '2024-01-15',
      behavior_pattern_classification: 'insufficient_followup',
      improvement_target_flag: 'judged',
      judgment_result: 'target',
      judgment_timestamp: '2024-01-15T09:30:00Z',
    });

    expect(result.processing_complete).toBe(true);
    expect(result.execution_log).toContain('Evaluated 3 sales representatives');
  });
});