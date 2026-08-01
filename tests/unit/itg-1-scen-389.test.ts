import { analyzeProposalDeviation } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-389
  test('[normal] 提案内容が標準プロセスと完全に乖離している場合、乖離度が1.0として数値化される', () => {
    const standard_process_stages = [
      { stage_id: 1, stage_name: '初期接触', sequence: 1 },
      { stage_id: 2, stage_name: 'ニーズ把握', sequence: 2 },
      { stage_id: 3, stage_name: '提案', sequence: 3 },
      { stage_id: 4, stage_name: 'クロージング', sequence: 4 },
    ];

    const proposal_data = {
      proposal_id: 'PROP-001',
      sales_rep_id: 'REP-001',
      customer_id: 'CUST-001',
      proposal_content: '独自製品説明のみ実施',
      process_steps_executed: [],
      needs_assessment_conducted: false,
      customer_inquiry_performed: false,
      standard_alignment_check: false,
    };

    const result = analyzeProposalDeviation(
      standard_process_stages,
      proposal_data
    );

    expect(result.deviation_score).toBe(1.0);
    expect(result.deviation_status).toBe('完全乖離');
    expect(result.deviation_score).toBeGreaterThanOrEqual(0);
    expect(result.deviation_score).toBeLessThanOrEqual(1.0);
  });
});