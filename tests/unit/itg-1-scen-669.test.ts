import { detectAnomalyPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-669
  test('[error] 提案内容データが null のとき異常パターン検出処理がエラーになる', () => {
    const behavior_pattern_data = {
      salesperson_id: 'SP001',
      proposal_content: null,
      customer_contact_frequency: 5,
      followup_interval_days: 3,
      contract_result: true,
    };

    expect(() => detectAnomalyPatterns(behavior_pattern_data)).toThrow(
      /提案内容が空のため異常パターン検出処理を実行できません/
    );

    try {
      detectAnomalyPatterns(behavior_pattern_data);
    } catch (error: any) {
      expect(error.code).toBe('INVALID_PROPOSAL_DATA');
    }
  });
});