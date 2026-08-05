import { convertProcessRequirementSpecification } from '../../src/logic/it-1';

describe('営業プロセス標準書の要件仕様変換機能', () => {
  // SCEN-192
  test('データ項目の型定義が不正なとき、型定義エラーが発生する', () => {
    const invalidDataItemsWithNullType = {
      processName: 'lead_qualification',
      dataItems: [
        {
          fieldName: 'customer_name',
          dataType: null,
          isMandatory: true,
          description: '顧客名'
        }
      ],
      processStages: ['initial_contact', 'proposal', 'negotiation']
    };

    expect(() =>
      convertProcessRequirementSpecification(invalidDataItemsWithNullType)
    ).toThrow(/型定義/);
  });
});