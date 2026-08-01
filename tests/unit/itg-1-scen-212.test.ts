import { analyzeAgentBehaviorPatternAndDetermineCoachingTarget } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-212
  test('顧客接触頻度が0回の場合、非接触として記録され分析対象外とされる', () => {
    const input_sales_person_id = 'SP-001';
    const input_customer_contact_frequency = 0;
    const input_behavioral_data = {
      sales_person_id: input_sales_person_id,
      customer_contact_frequency: input_customer_contact_frequency,
      proposal_success_rate: 0.0,
      followup_interval_days: 0,
      process_compliance_score: 0.0,
      contract_achievement_rate: 0.0,
    };

    const result = analyzeAgentBehaviorPatternAndDetermineCoachingTarget(
      input_behavioral_data
    );

    expect(result.contact_status).toBe('非接触');
    expect(result.analysis_target_flag).toBe(false);
    expect(result.coaching_target_list).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          sales_person_id: input_sales_person_id,
        }),
      ])
    );
  });
});