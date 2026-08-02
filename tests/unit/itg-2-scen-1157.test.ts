import { validateCustomerDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  test('SCEN-1157: メールアドレス形式が不正な顧客データに対して検証を実行した場合、データ形式エラーが検出される', () => {
    const invalidEmails = [
      'user@domain',
      'user@.com',
      'user domain@example.com',
    ];

    invalidEmails.forEach((invalidEmail) => {
      const customerData = {
        id: 'CUST-001',
        name: 'Test Customer',
        email: invalidEmail,
      };

      const result = validateCustomerDataQuality(customerData);

      expect(result.errors).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);

      const emailError = result.errors.find(
        (error) => error.field === 'email'
      );
      expect(emailError).toBeDefined();
      expect(emailError?.errorCode).toBe('INVALID_EMAIL_FORMAT');
      expect(emailError?.errorType).toBe('format_error');
      expect(emailError?.field).toBe('email');
      expect(emailError?.message).toBe('メールアドレス形式が正しくありません');
    });
  });
});