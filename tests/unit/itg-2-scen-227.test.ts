import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - プロセス標準書のシステム要件変換', () => {
  // SCEN-227
  test('プロセス標準書がドラフト状態のとき、システム要件への変換が開始されない', () => {
    const process_standard_id = 'PS-001';
    const process_standard_status = 'draft';
    const process_standard_name = 'Sales Process Standard v1';
    const process_standard_content = {
      steps: [
        { step_number: 1, step_name: '初回接触', criteria: '顧客情報確認' },
        { step_number: 2, step_name: '提案', criteria: '提案資料提出' },
      ],
      data_items: ['customer_id', 'proposal_date', 'proposal_amount'],
    };

    const input = {
      process_standard_id: process_standard_id,
      status: process_standard_status,
      name: process_standard_name,
      content: process_standard_content,
    };

    expect(() => convertProcessStandardToSystemRequirements(input)).toThrow(/ドラフト状態/);
  });
});