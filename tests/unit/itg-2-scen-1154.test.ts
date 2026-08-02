import { validateCustomerData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  test('SCEN-1154: 電話番号フィールドが空の顧客データに対して検証を実行した場合、入力漏れエラーが検出される', () => {
    const customerData = {
      customerId: 'CUST-001',
      customerName: 'テスト会社',
      email: 'test@example.com',
      phoneNumber: '',
      address: '東京都渋谷区',
      industryCode: 'IT',
      employeeCount: 50,
    };

    const validationResult = validateCustomerData(customerData);

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          errorCode: 'MISSING_PHONE_NUMBER',
          errorLevel: 'error',
          errorMessage: '電話番号は必須項目です',
        }),
      ])
    );
  });
});