import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-138
  test('プロセス標準書のシステム要件変換機能 - データ型が許可リストにない場合はエラーになる', () => {
    const processStandardData = {
      processId: 'PROC_001',
      processName: '営業プロセス標準書',
      dataItems: [
        {
          dataItemId: 'ITEM_001',
          dataItemName: '顧客ID',
          dataType: 'DECIMAL',
          mandatory: true,
        },
      ],
      stages: [
        {
          stageId: 'STAGE_001',
          stageName: '初回接触',
          requiredDataItems: ['ITEM_001'],
        },
      ],
    };

    expect(() => {
      convertProcessStandardToSystemRequirements(processStandardData);
    }).toThrow(/ERR_INVALID_DATA_TYPE/);
  });
});