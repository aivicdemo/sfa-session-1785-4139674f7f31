import { detectAndLogInconsistencies } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1139
  test('顧客データに不整合が検出された場合、不整合ログが記録される', () => {
    const existing_customer = {
      customer_id: 'C001',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone: '09012345678',
    };

    const input_customer = {
      customer_id: 'C001',
      name: '山田 太郎',
      email: 'yamada.taro@example.com',
      phone: '09-0123-45678',
    };

    const execution_timestamp = new Date('2024-01-15T11:00:00Z');

    const result = detectAndLogInconsistencies(
      existing_customer,
      input_customer,
      execution_timestamp
    );

    expect(result).toEqual({
      log_id: expect.any(String),
      customer_id: 'C001',
      inconsistency_type: '形式不整合',
      detected_fields: 'name, email, phone',
      existing_values: '山田太郎 | yamada@example.com | 09012345678',
      input_values: '山田 太郎 | yamada.taro@example.com | 09-0123-45678',
      severity: 'medium',
      recorded_at: '2024-01-15T11:00:00Z',
      status: 'pending_review',
    });
  });
});