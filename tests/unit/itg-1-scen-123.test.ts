import { convertProcessStandardToSystemRequirement } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  test('SCEN-123: データ項目のデータ型が欠落している場合、変換処理がエラーになる', () => {
    const processStandardInput = {
      processId: 'PROC-001',
      processName: '営業プロセス標準書',
      processStages: [
        {
          stageId: 'STAGE-001',
          stageName: '初回接触',
          dataItems: [
            {
              itemId: 'ITEM-001',
              itemName: '顧客ID',
              description: '顧客を識別するための一意のID',
              dataType: null as any,
              isMandatory: true,
            },
          ],
        },
      ],
    };

    expect(() => {
      convertProcessStandardToSystemRequirement(processStandardInput);
    }).toThrow(/データ型/);
  });
});