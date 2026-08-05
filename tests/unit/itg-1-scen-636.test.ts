import { analyzeProcessDeviationForReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-636
  test('提案内容の標準プロセス乖離度が許容閾値直下（+4.9%）のとき、許容範囲内として判定される', () => {
    const salesProposal = {
      proposal_id: 'PROP-001',
      sales_representative_id: 'SR-001',
      customer_id: 'CUST-001',
      proposed_approach: 'initial_contact_via_email',
      proposed_timing: new Date('2024-01-15T10:00:00Z').toISOString(),
      standard_process_stage: 'initial_contact',
      actual_stage: 'initial_contact',
      deviation_percentage: 4.9,
      created_at: new Date('2024-01-15T10:00:00Z').toISOString(),
    };

    const tolerance_threshold = 5.0;

    const result = analyzeProcessDeviationForReport(salesProposal, tolerance_threshold);

    expect(result.judgment_status).toBe('許容範囲内');
    expect(result.is_within_tolerance).toBe(true);
    expect(result.deviation_percentage).toBe(4.9);
    expect(result.tolerance_threshold).toBe(5.0);
    expect(result.compliant).toBe(true);
  });
});