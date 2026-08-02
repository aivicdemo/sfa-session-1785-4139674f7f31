import { validateQualityOfNormalizedCustomerData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  test('SCEN-588: 正規化済み顧客データ0件の場合、品質検証結果が空配列で返される', () => {
    const normalizedCustomerData: any[] = [];
    const validationResult = validateQualityOfNormalizedCustomerData(normalizedCustomerData);
    expect(validationResult).toEqual([]);
  });
});