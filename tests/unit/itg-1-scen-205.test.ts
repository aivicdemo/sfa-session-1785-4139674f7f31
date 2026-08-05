import { convertProcessDefinitionToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能 - データ項目上限値チェック', () => {
  // SCEN-205
  test('1001個のデータ項目を含むプロセス標準書の変換が拒否される', () => {
    const data_items = Array.from({ length: 1001 }, (_, i) => ({
      item_id: `item_${String(i + 1).padStart(4, '0')}`,
      item_name: `Data Item ${i + 1}`,
      data_type: 'string',
      is_required: true,
    }));

    const process_definition = {
      process_id: 'proc_001',
      process_name: '営業プロセス標準書',
      stages: [
        {
          stage_id: 'stage_001',
          stage_name: 'Initial Contact',
          data_items: data_items,
        },
      ],
    };

    const error_result = expect(() =>
      convertProcessDefinitionToSystemRequirements(process_definition)
    ).toThrow(/データ項目数が上限値1000件を超えています/);

    expect(error_result).toBeDefined();
  });
});