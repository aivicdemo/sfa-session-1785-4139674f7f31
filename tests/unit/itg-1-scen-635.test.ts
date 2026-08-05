import { analyzeProposalProcessDeviation } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-635: 提案内容の標準プロセス乖離度がちょうど許容閾値（±5%）のとき、乖離度として正確に記録される
  test('should record proposal process deviation exactly at tolerance threshold of ±5%', () => {
    // Arrange: 標準プロセス定義（各ステップの標準所要時間）
    const standard_process_steps = [
      { step_name: 'initial_contact', standard_hours: 20 },
      { step_name: 'needs_analysis', standard_hours: 30 },
      { step_name: 'proposal_creation', standard_hours: 25 },
      { step_name: 'proposal_execution', standard_hours: 15 },
      { step_name: 'closing', standard_hours: 10 }
    ];

    const total_standard_hours = 100;
    const tolerance_threshold = 5.0; // ±5%

    // Case 1: 実績を95時間（-5%）に設定
    const proposal_actual_hours_case_1 = 95;
    const deviation_percentage_case_1 = ((proposal_actual_hours_case_1 - total_standard_hours) / total_standard_hours) * 100;

    const proposal_data_case_1 = {
      proposal_id: 'PROP-001-MINUS-5',
      salesperson_id: 'SP-001',
      customer_id: 'CUST-001',
      proposal_steps: [
        { step_name: 'initial_contact', actual_hours: 19 },
        { step_name: 'needs_analysis', standard_hours: 28.5 },
        { step_name: 'proposal_creation', actual_hours: 23.75 },
        { step_name: 'proposal_execution', actual_hours: 14.25 },
        { step_name: 'closing', actual_hours: 9.5 }
      ],
      total_actual_hours: proposal_actual_hours_case_1,
      standard_process_definition: standard_process_steps,
      tolerance_threshold_percent: tolerance_threshold
    };

    const result_case_1 = analyzeProposalProcessDeviation(proposal_data_case_1);

    expect(result_case_1.deviation_percentage).toBe(-5.0);
    expect(result_case_1.deviation_percentage_formatted).toBe('-5.00%');
    expect(result_case_1.is_within_tolerance).toBe(true);
    expect(result_case_1.compliance_status).toBe('within_tolerance');

    // Case 2: 実績を105時間（+5%）に設定
    const proposal_actual_hours_case_2 = 105;
    const deviation_percentage_case_2 = ((proposal_actual_hours_case_2 - total_standard_hours) / total_standard_hours) * 100;

    const proposal_data_case_2 = {
      proposal_id: 'PROP-002-PLUS-5',
      salesperson_id: 'SP-002',
      customer_id: 'CUST-002',
      proposal_steps: [
        { step_name: 'initial_contact', actual_hours: 21 },
        { step_name: 'needs_analysis', actual_hours: 31.5 },
        { step_name: 'proposal_creation', actual_hours: 26.25 },
        { step_name: 'proposal_execution', actual_hours: 15.75 },
        { step_name: 'closing', actual_hours: 10.5 }
      ],
      total_actual_hours: proposal_actual_hours_case_2,
      standard_process_definition: standard_process_steps,
      tolerance_threshold_percent: tolerance_threshold
    };

    const result_case_2 = analyzeProposalProcessDeviation(proposal_data_case_2);

    expect(result_case_2.deviation_percentage).toBe(5.0);
    expect(result_case_2.deviation_percentage_formatted).toBe('5.00%');
    expect(result_case_2.is_within_tolerance).toBe(true);
    expect(result_case_2.compliance_status).toBe('within_tolerance');

    // Verify precision to 2 decimal places for both cases
    expect(result_case_1.deviation_percentage).toEqual(expect.any(Number));
    expect(result_case_2.deviation_percentage).toEqual(expect.any(Number));
    
    // Ensure decimal precision
    const case_1_decimal_check = Math.abs(result_case_1.deviation_percentage - (-5.0)) < 0.001;
    const case_2_decimal_check = Math.abs(result_case_2.deviation_percentage - 5.0) < 0.001;
    
    expect(case_1_decimal_check).toBe(true);
    expect(case_2_decimal_check).toBe(true);

    // Verify classification consistency
    expect(result_case_1.proposal_id).toBe('PROP-001-MINUS-5');
    expect(result_case_2.proposal_id).toBe('PROP-002-PLUS-5');
  });
});