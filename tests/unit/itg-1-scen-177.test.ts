import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-177
  test('プロセス各段階の定義が null のとき、入力値未設定エラーが発生する', () => {
    const process_standard_with_null_stages = {
      process_id: 'ps_001',
      process_name: '営業標準プロセス',
      description: 'テスト用営業プロセス',
      proposal_stage: null,
      contract_stage: null,
      delivery_stage: null,
      created_at: new Date('2024-01-15T10:00:00Z'),
    };

    expect(() =>
      convertProcessStandardToSystemRequirements(process_standard_with_null_stages)
    ).toThrow(/プロセス各段階/);
  });
});