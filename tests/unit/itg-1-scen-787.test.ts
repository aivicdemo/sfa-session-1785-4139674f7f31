import { calculateProcessDeviationScore } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-787
  test('標準プロセスとの乖離度が0%（完全一致）の営業担当者について乖離なしと判定される', () => {
    const standard_process_template = {
      initial_contact_count: 3,
      proposal_delivery_count: 2,
      followup_interval_days: 7,
      negotiation_count: 2,
      contract_steps: 4,
    };

    const sales_rep_behavior_log = {
      initial_contact_count: 3,
      proposal_delivery_count: 2,
      followup_interval_days: 7,
      negotiation_count: 2,
      contract_steps: 4,
    };

    const result = calculateProcessDeviationScore(
      sales_rep_behavior_log,
      standard_process_template
    );

    expect(result.deviation_score).toBe(0);
    expect(result.deviation_status).toBe('乖離なし');
    expect(result.matches_standard_process).toBe(true);
  });
});