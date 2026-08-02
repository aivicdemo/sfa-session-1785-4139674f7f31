import { validateCustomerData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1156
  test('顧客名に不正な特殊文字が含まれている場合、DataFormatErrorが検出される', () => {
    const invalid_customer_data = {
      customerName: '<script>alert("xss")</script>',
      customerId: 'CUST001',
      email: 'test@example.com'
    };

    expect(() => validateCustomerData(invalid_customer_data)).toThrow(/INVALID_CHARACTER_IN_CUSTOMER_NAME/);
  });
});