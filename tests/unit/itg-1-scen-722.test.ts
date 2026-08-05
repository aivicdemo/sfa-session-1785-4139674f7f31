import { analyzeAnomalousPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-722
  test('提案内容と顧客対応パターンの標準プロセス比較分析 - 分析期間が同日の場合', () => {
    const analysis_start_date = '2024-01-15';
    const analysis_end_date = '2024-01-15';

    const sample_proposals = [
      {
        proposal_id: 'prop_001',
        salesperson_id: 'sales_001',
        proposal_date: '2024-01-15',
        proposal_content: 'Product A with standard terms',
        customer_response_pattern: 'no_response',
      },
      {
        proposal_id: 'prop_002',
        salesperson_id: 'sales_002',
        proposal_date: '2024-01-15',
        proposal_content: 'Product B with discount',
        customer_response_pattern: 'positive_response',
      },
    ];

    const standard_process_definition = {
      step_1_initial_contact: {
        target_frequency_days: 3,
        success_indicator: 'contact_established',
      },
      step_2_proposal: {
        target_frequency_days: 7,
        success_indicator: 'proposal_accepted',
      },
      step_3_negotiation: {
        target_frequency_days: 5,
        success_indicator: 'agreement_reached',
      },
      step_4_closing: {
        target_frequency_days: 3,
        success_indicator: 'contract_signed',
      },
    };

    const result = analyzeAnomalousPatterns({
      analysis_start_date,
      analysis_end_date,
      proposals: sample_proposals,
      standard_process_definition,
    });

    expect(result).toEqual({
      analysis_period_days: 1,
      warning_message: '分析対象期間が1日のため、比較分析データが不足している',
      warning_level: 'warning',
      anomalous_patterns_count: 0,
      anomalous_patterns: [],
      analysis_completed: true,
    });
  });
});