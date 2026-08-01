import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-119
  test('必須データ項目が1件の場合、1件分のデータ項目仕様が生成される', () => {
    const processStandardInput = {
      processName: '営業プロセス標準書',
      version: '1.0',
      requiredDataItems: [
        {
          itemName: '顧客ID',
          dataType: '文字列',
          maxLength: 20,
          required: true,
        },
      ],
    };

    const result = convertProcessStandardToSystemRequirements(processStandardInput);

    expect(result.dataItemSpecifications).toHaveLength(1);
    expect(result.dataItemSpecifications[0]).toEqual({
      itemName: '顧客ID',
      dataType: '文字列',
      maxLength: 20,
      required: true,
    });
  });
});