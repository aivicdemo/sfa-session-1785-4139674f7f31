import { analyzeProcessDeviationAndCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業プロセス標準書との乖離分析と成約実績の相関分析', () => {
  // SCEN-849
  test('乖離度がちょうど0%の場合、標準プロセス完全準拠と判定する', () => {
    const standard_process_checkpoints = [
      { checkpoint_id: 'CP001', checkpoint_name: '初回接触' },
      { checkpoint_id: 'CP002', checkpoint_name: 'ヒアリング' },
      { checkpoint_id: 'CP003', checkpoint_name: '提案' },
      { checkpoint_id: 'CP004', checkpoint_name: 'クロージング' },
    ];

    const salesperson_actual_steps = [
      { step_id: 'ST001', step_name: '初回接触', executed_at: '2024-01-15T09:00:00Z' },
      { step_id: 'ST002', step_name: 'ヒアリング', executed_at: '2024-01-15T10:30:00Z' },
      { step_id: 'ST003', step_name: '提案', executed_at: '2024-01-16T14:00:00Z' },
      { step_id: 'ST004', step_name: 'クロージング', executed_at: '2024-01-17T11:00:00Z' },
    ];

    const contract_result = {
      contract_id: 'CNT20240117001',
      salesperson_id: 'SP001',
      contract_amount: 500000,
      contract_date: '2024-01-17T11:30:00Z',
      contract_status: 'COMPLETED',
    };

    const result = analyzeProcessDeviationAndCorrelation({
      standard_checkpoints: standard_process_checkpoints,
      actual_steps: salesperson_actual_steps,
      contract_data: contract_result,
      salesperson_id: 'SP001',
      analysis_period_start: '2024-01-01T00:00:00Z',
      analysis_period_end: '2024-01-31T23:59:59Z',
    });

    expect(result.deviation_percentage).toBe(0.0);
    expect(result.compliance_status).toBe('FULL_COMPLIANCE');
    expect(result.matched_checkpoints_count).toBe(4);
    expect(result.total_checkpoints_count).toBe(4);
    expect(result.deviation_formula).toBe('100 - (0 / 4) × 100');
    expect(result.audit_log).toBeDefined();
    expect(result.audit_log.checkpoints_verified).toBe(4);
    expect(result.audit_log.checkpoints_matched).toBe(4);
    expect(result.audit_log.calculation_basis).toBe('Full compliance: all 4 process steps executed in order');
    expect(result.audit_log.verification_timestamp).toBeDefined();
  });
});