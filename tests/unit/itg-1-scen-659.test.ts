import { analyzeProposalAndCustomerInteractionPattern } from '../../src/logic/it-1-br-2-1-1';

describe('提案内容と顧客対応パターンの標準プロセス比較分析', () => {
  // SCEN-659
  test('標準プロセスからの逸脱を検出し、異常パターンレポートを生成する', () => {
    const standard_process_template = {
      process_id: 'proc_001',
      phase_name: '提案フェーズ',
      steps: [
        {
          step_id: 'step_001',
          step_name: '製品説明',
          sequence: 1,
          required: true,
        },
        {
          step_id: 'step_002',
          step_name: '顧客ニーズ確認',
          sequence: 2,
          required: true,
        },
        {
          step_id: 'step_003',
          step_name: '見積提示',
          sequence: 3,
          required: true,
        },
      ],
    };

    const proposal_record = {
      proposal_id: 'prop_001',
      sales_rep_id: 'rep_a_001',
      customer_id: 'cust_001',
      execution_steps: [
        {
          step_name: '製品説明',
          executed_at: '2024-01-15T10:00:00Z',
          sequence_in_record: 1,
        },
        {
          step_name: '見積提示',
          executed_at: '2024-01-15T10:30:00Z',
          sequence_in_record: 2,
        },
      ],
    };

    const result = analyzeProposalAndCustomerInteractionPattern(
      standard_process_template,
      proposal_record,
    );

    expect(result).toBeDefined();
    expect(result.anomaly_detected).toBe(true);
    expect(result.anomaly_report).toBeDefined();
    expect(result.anomaly_report.sales_rep_id).toBe('rep_a_001');
    expect(result.anomaly_report.proposal_id).toBe('prop_001');

    expect(result.anomaly_report.deviations).toHaveLength(1);
    expect(result.anomaly_report.deviations[0]).toEqual({
      deviated_step_name: '顧客ニーズ確認',
      deviation_type: '省略',
      severity: '高',
      expected_sequence: 2,
      standard_step_id: 'step_002',
      description:
        '標準プロセス上で必須のステップ「顧客ニーズ確認」がスキップされている',
    });

    expect(result.anomaly_report.overall_compliance_rate).toBe(66.67);
    expect(result.anomaly_report.status).toBe('detected');
  });
});