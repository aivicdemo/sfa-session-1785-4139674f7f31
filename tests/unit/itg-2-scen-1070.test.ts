import { defineCollectionRequirements } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業事例データ収集定義エンジン', () => {
  // SCEN-1070
  test('必須データ項目が1個で設定される', () => {
    const requiredFields = ['顧客名'];
    const result = defineCollectionRequirements({
      requiredFields,
    });

    expect(result.requiredFields).toHaveLength(1);
    expect(result.requiredFields[0]).toBe('顧客名');
  });
});