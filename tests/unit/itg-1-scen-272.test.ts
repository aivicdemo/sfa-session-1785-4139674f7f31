import { analyzeAndJudgeSalesRepImprovement } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-272: [error] 営業担当者行動パターン分析・改善指導判定機能 - 顧客接触頻度が null のとき、処理が中断される
  test('should abort processing and return CONTACT_FREQUENCY_NULL_ERROR when customer_contact_frequency is null', () => {
    const input = {
      sales_rep_id: 'SR001',
      analysis_period_start_date: '2024-01-01',
      analysis_period_end_date: '2024-01-31',
      standard_process_definition_id: 'PROC001',
      customer_contact_frequency: null,
      proposal_success_rate: 0.65,
      followup_interval_days: 5,
      standard_contact_frequency_min: 3,
      standard_proposal_success_rate_min: 0.70,
      standard_followup_interval_max_days: 7,
    };

    expect(() => analyzeAndJudgeSalesRepImprovement(input)).toThrow(
      /CONTACT_FREQUENCY_NULL_ERROR/
    );
  });
});