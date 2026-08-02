import { analyzeProcessComplianceDeviation } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業プロセス実行状況分析機能', () => {
  // SCEN-782
  test('標準プロセスからの乖離度が閾値未満の場合、許容範囲内として判定される', () => {
    const standard_process_period_days = 30;
    const phase_compliance_baseline = {
      initial_contact: 100,
      proposal: 100,
      negotiation: 100,
      closure: 100,
    };
    const deviation_threshold_percent = 5;

    const actual_process_period_days = 31;
    const phase_compliance_actual = {
      initial_contact: 98,
      proposal: 98,
      negotiation: 98,
      closure: 98,
    };
    const calculated_deviation_percent = 3.2;

    const result = analyzeProcessComplianceDeviation({
      standard_process_period_days,
      phase_compliance_baseline,
      deviation_threshold_percent,
      actual_process_period_days,
      phase_compliance_actual,
      calculated_deviation_percent,
    });

    expect(result.judgment).toBe('ACCEPTABLE');
    expect(result.status).toBe('ACCEPTABLE');
    expect(result.deviation_detail_percent).toBe(3.2);
    expect(result.is_within_tolerance).toBe(true);
  });
});