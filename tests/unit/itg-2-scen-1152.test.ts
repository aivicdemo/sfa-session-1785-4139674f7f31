import { validateCustomerData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1152
  test('顧客コードフィールドが空の顧客データに対して検証を実行した場合、入力漏れエラーが検出される', () => {
    const customerData = {
      customer_code: '',
      customer_name: 'テスト顧客',
      industry: '製造業',
      employee_count: 500,
    };

    const result = validateCustomerData(customerData);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toEqual({
      error_code: 'CUSTOMER_CODE_REQUIRED',
      error_message: '顧客コードは必須項目です',
      error_type: '入力漏れエラー',
    });
  });
});