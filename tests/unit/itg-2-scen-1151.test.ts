import { validateCustomerData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1151
  test('顧客名フィールドが空の顧客データに対して検証を実行した場合、入力漏れエラーが検出される', () => {
    const customerData = {
      customerName: '',
      customerId: 'CUST001',
      email: 'test@example.com',
      phone: '090-0000-0000',
    };

    const result = validateCustomerData(customerData);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toEqual({
      errorCode: 'CUSTOMER_NAME_EMPTY',
      errorMessage: '顧客名は必須項目です',
      errorType: 'INPUT_MISSING',
    });
  });
});