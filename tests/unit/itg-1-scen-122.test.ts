import { convertProcessStandardToSystemRequirement } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-122
  test('プロセス標準書のシステム要件変換機能 - データ項目の項目名が空文字列の場合、変換処理がエラーになる', () => {
    const processStandardInput = {
      processId: 'PROC-001',
      processName: '営業プロセス標準',
      stages: [
        {
          stageId: 'STAGE-001',
          stageName: '初回接触',
          dataItems: [
            {
              itemId: 'ITEM-001',
              itemName: '',
              dataType: 'string',
              isMandatory: true,
              validationRule: 'not_empty'
            }
          ]
        }
      ]
    };

    expect(() => convertProcessStandardToSystemRequirement(processStandardInput)).toThrow(/データ項目の項目名は必須項目です/);
  });
});