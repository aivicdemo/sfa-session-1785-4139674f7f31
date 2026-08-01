import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-124
  test('データ項目のデータ型が空文字列の場合、エラーを返す', () => {
    const input = {
      processId: 'PROC-001',
      processName: '営業プロセス標準書',
      stages: [
        {
          stageId: 'STAGE-01',
          stageName: '初回接触',
          dataItems: [
            {
              itemId: 'ITEM-001',
              itemName: '顧客名',
              dataType: '',
              isMandatory: true,
            },
          ],
          transitionRules: [],
          kpiCriteria: [],
        },
      ],
    };

    const result = convertProcessStandardToSystemRequirements(input);

    expect(result).toEqual({
      success: false,
      errorCode: 'INVALID_DATA_TYPE',
      errorMessage: 'データ型が指定されていません',
      systemRequirements: null,
    });
  });
});