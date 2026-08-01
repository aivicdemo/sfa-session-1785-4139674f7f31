import { analyzeActionPatternDeviation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-788
  test('標準プロセスとの乖離度がちょうど許容閾値（±5%）の営業担当者について乖離ありと判定される', () => {
    // 標準プロセス定義
    const standard_process = {
      initial_contact_frequency: 2.0,
      proposal_success_rate: 0.65,
      follow_up_interval_days: 3.0,
      negotiation_duration_days: 14.0,
    };

    // ケース1: 乖離度がちょうど +5.0% の営業担当者A のデータ
    const sales_rep_a_positive = {
      sales_rep_id: 'SREP-001',
      name: 'Sales Rep A',
      initial_contact_frequency: 2.1,
      proposal_success_rate: 0.6825,
      follow_up_interval_days: 3.15,
      negotiation_duration_days: 14.7,
    };

    const result_positive = analyzeActionPatternDeviation(
      sales_rep_a_positive,
      standard_process
    );

    expect(result_positive.deviationStatus).toBe('EXCEEDED');
    expect(result_positive.deviationPercentage).toBe(5.0);

    // ケース2: 乖離度がちょうど -5.0% の営業担当者B のデータ
    const sales_rep_b_negative = {
      sales_rep_id: 'SREP-002',
      name: 'Sales Rep B',
      initial_contact_frequency: 1.9,
      proposal_success_rate: 0.6175,
      follow_up_interval_days: 2.85,
      negotiation_duration_days: 13.3,
    };

    const result_negative = analyzeActionPatternDeviation(
      sales_rep_b_negative,
      standard_process
    );

    expect(result_negative.deviationStatus).toBe('EXCEEDED');
    expect(result_negative.deviationPercentage).toBe(-5.0);
  });
});