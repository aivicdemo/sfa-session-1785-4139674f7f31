import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-121
  test('データ項目の項目名が欠落している場合、エラーコードITEM_NAME_MISSINGを含むエラーが返される', () => {
    const input = {
      processId: 'PROC-001',
      processName: '営業提案プロセス',
      stages: [
        {
          stageId: 'STAGE-01',
          stageName: '初回接触',
          dataItems: [
            {
              itemName: '',
              dataType: 'STRING',
              itemDescription: '顧客名称',
              isMandatory: true
            },
            {
              itemName: 'customer_contact_date',
              dataType: 'DATE',
              itemDescription: '顧客接触日時',
              isMandatory: true
            }
          ]
        }
      ]
    };

    expect(() => convertProcessStandardToSystemRequirements(input)).toThrow(/ITEM_NAME_MISSING/);
  });
});