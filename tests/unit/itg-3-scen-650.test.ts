import { validateCustomerEmailInput } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-650: [edge] 顧客情報入力検証機能 - メールアドレス形式が正しいとき、入力受け付けが完了する
  test('should accept and validate customer email input when format is correct', () => {
    const customer_email = 'user@example.com';

    const result = validateCustomerEmailInput({
      email: customer_email,
    });

    expect(result.is_valid).toBe(true);
    expect(result.validation_status).toBe('入力受け付け完了');
    expect(result.error_message).toBeNull();
    expect(result.email_normalized).toBe('user@example.com');
  });
});