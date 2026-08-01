import { analyzeDeviationAndCorrelation } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-174: [error] 営業担当者行動パターン分析・改善指導対象判定機能 - 乖離度が計算されていない場合、相関分析がスキップされる
  test('should skip correlation analysis when deviation score is not calculated', () => {
    const sales_representative_id = 'SR001';
    const visit_count = 25;
    const proposal_count = 8;
    const contract_rate = 0.32;
    const contact_frequency = 4.2;
    const standard_process_steps = ['initial_contact', 'proposal', 'negotiation', 'contract'];

    const input_data = {
      sales_representative_id,
      visit_count,
      proposal_count,
      contract_rate,
      contact_frequency,
      standard_process_steps,
      deviation_score: null,
    };

    const result = analyzeDeviationAndCorrelation(input_data);

    expect(result).toEqual({
      analysis_completed: false,
      correlation_analysis_skipped: true,
      deviation_score: null,
      correlation_result: null,
      message: '乖離度が未計算のため相関分析をスキップしました',
      improvement_target_status: 'pending',
    });
  });
});