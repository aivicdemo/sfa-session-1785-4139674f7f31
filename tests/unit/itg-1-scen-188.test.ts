import { convertProcessStandardToRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-188
  test('プロセス標準書変換権限がないとき、権限不足エラーが発生する', () => {
    const user_id = 'it_user_001';
    const user_permissions = ['VIEW_DASHBOARD', 'EXPORT_DATA'];
    const process_standard_id = 'proc_std_2024_001';
    const process_standard_content = {
      name: '営業プロセス標準書_2024年版',
      stages: [
        {
          stage_id: 'stage_initial',
          stage_name: '初回接触',
          required_actions: ['顧客情報確認', '初回提案'],
          kpi_threshold: 0.8,
        },
        {
          stage_id: 'stage_negotiation',
          stage_name: '交渉',
          required_actions: ['提案修正', '条件交渉'],
          kpi_threshold: 0.7,
        },
      ],
      transition_rules: [
        {
          from_stage: 'stage_initial',
          to_stage: 'stage_negotiation',
          condition: '顧客の基本ニーズ確認完了',
        },
      ],
      data_items: ['customer_id', 'proposal_date', 'proposal_amount'],
    };

    const input_params = {
      user_id: user_id,
      user_permissions: user_permissions,
      process_standard_id: process_standard_id,
      process_standard_content: process_standard_content,
    };

    expect(() => convertProcessStandardToRequirements(input_params)).toThrow(
      /権限/
    );
  });
});