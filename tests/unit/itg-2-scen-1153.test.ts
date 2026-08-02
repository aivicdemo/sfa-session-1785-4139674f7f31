import { validateSalesData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1153
  test('メールアドレスフィールドが空の顧客データに対して検証を実行した場合、入力漏れエラーが検出される', () => {
    const customer_data = {
      customer_id: 'C001',
      customer_name: '株式会社テスト',
      email: '',
      phone: '03-1234-5678',
      address: '東京都渋谷区',
      industry: 'IT',
      company_size: 'mid'
    };

    const validation_result = validateSalesData(customer_data);

    expect(validation_result.status).toBe('FAILED');
    expect(Array.isArray(validation_result.errors)).toBe(true);
    expect(validation_result.errors.length).toBeGreaterThanOrEqual(1);

    const email_error = validation_result.errors.find(
      (err: { error_code?: string; error_type?: string }) =>
        err.error_code === 'EMPTY_EMAIL_FIELD' || err.error_type === 'INPUT_OMISSION_ERROR'
    );

    expect(email_error).toBeDefined();
    expect(email_error.error_message).toMatch(/メールアドレス/);
  });
});