import { validate } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1155
  test('住所フィールドが空の顧客データに対して検証を実行した場合、入力漏れエラーが検出される', () => {
    const customerData = {
      customerName: '山田太郎',
      phoneNumber: '090-1234-5678',
      addressField: '',
    };

    const result = validate(customerData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toEqual({
      errorCode: 'MISSING_ADDRESS',
      errorMessage: '住所は必須項目です',
      targetField: 'addressField',
    });
  });
});