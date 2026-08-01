import { generateSalesProcessAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-322
  test('[edge] 標準プロセスからの乖離度がちょうど0%の場合、正常に判定される', () => {
    const sales_person_id = 'SP001';
    const analysis_period_start = new Date('2024-01-01T00:00:00Z');
    const analysis_period_end = new Date('2024-01-31T23:59:59Z');

    const standard_process_steps = [
      {
        step_id: 'STEP_001',
        step_name: '初回接触',
        target_contact_frequency: 1,
        expected_duration_days: 7,
      },
      {
        step_id: 'STEP_002',
        step_name: '提案',
        target_proposal_count: 1,
        expected_duration_days: 14,
      },
      {
        step_id: 'STEP_003',
        step_name: '交渉',
        target_negotiation_count: 2,
        expected_duration_days: 21,
      },
      {
        step_id: 'STEP_004',
        step_name: '成約',
        target_contract_count: 1,
        expected_duration_days: 7,
      },
    ];

    const actual_behavior_data = [
      {
        step_id: 'STEP_001',
        actual_contact_frequency: 1,
        actual_duration_days: 7,
        actual_proposal_count: 0,
        actual_negotiation_count: 0,
        actual_contract_count: 0,
      },
      {
        step_id: 'STEP_002',
        actual_contact_frequency: 0,
        actual_duration_days: 0,
        actual_proposal_count: 1,
        actual_negotiation_count: 0,
        actual_contract_count: 0,
      },
      {
        step_id: 'STEP_003',
        actual_contact_frequency: 0,
        actual_duration_days: 0,
        actual_proposal_count: 0,
        actual_negotiation_count: 2,
        actual_contract_count: 0,
      },
      {
        step_id: 'STEP_004',
        actual_contact_frequency: 0,
        actual_duration_days: 0,
        actual_proposal_count: 0,
        actual_negotiation_count: 0,
        actual_contract_count: 1,
      },
    ];

    const result = generateSalesProcessAnalysisReport({
      sales_person_id,
      analysis_period_start,
      analysis_period_end,
      standard_process_steps,
      actual_behavior_data,
    });

    expect(result).toEqual({
      sales_person_id: 'SP001',
      deviation_percentage: 0,
      compliance_status: '標準プロセス完全準拠',
      classification_label: '準拠（乖離度0%）',
      analysis_period_start: new Date('2024-01-01T00:00:00Z'),
      analysis_period_end: new Date('2024-01-31T23:59:59Z'),
    });
  });
});