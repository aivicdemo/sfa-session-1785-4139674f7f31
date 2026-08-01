import { analyzeSellerBehaviorPattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-449
  test('[normal] 標準プロセスと完全に合致する場合、異常なしとして可視化される', () => {
    const seller_id = 'EMP-001';
    const initial_contact_date = '2024-01-15';
    const proposal_send_date = '2024-01-18';
    const followup_date = '2024-01-22';
    const contract_date = '2024-01-29';

    const standard_process_def = {
      stage_1_to_2_days: 5,
      stage_2_to_3_days: 3,
      stage_3_to_4_days: 7,
    };

    const behavior_log = {
      seller_id,
      initial_contact_date,
      proposal_send_date,
      followup_date,
      contract_date,
    };

    const result = analyzeSellerBehaviorPattern(behavior_log, standard_process_def);

    expect(result.status).toBe('normal');
    expect(result.process_adherence_rate).toBe(100);
    expect(result.has_warning).toBe(false);
    expect(result.has_alert_badge).toBe(false);
    expect(result.deviation_patterns).toEqual([]);
  });
});