import { detectInconsistenciesAndValidate } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-825
  test('不整合ログが複数件検出される場合、品質検証結果に全件が記録される', () => {
    const testDataset = [
      {
        customer_id: 'CUST001',
        customer_name: '山田太郎',
        email: 'mail_1@example.com',
        phone: '09011112222',
        address: '東京都渋谷区',
        postal_code: '150-0001',
        created_at: '2024-01-15T10:00:00Z',
      },
      {
        customer_id: 'CUST001',
        customer_name: '山田太郎',
        email: 'mail_2@example.com',
        phone: '09011112222',
        address: '東京都渋谷区',
        postal_code: '150-0001',
        created_at: '2024-01-15T10:05:00Z',
      },
      {
        customer_id: 'CUST001',
        customer_name: '山田太郎',
        email: 'mail_1@example.com',
        phone: '09033334444',
        address: '東京都渋谷区',
        postal_code: '150-0001',
        created_at: '2024-01-15T10:10:00Z',
      },
      {
        customer_id: 'CUST001',
        customer_name: '山田太郎',
        email: 'mail_1@example.com',
        phone: '09011112222',
        address: '東京都渋谷区',
        postal_code: '150-0002',
        created_at: '2024-01-15T10:15:00Z',
      },
      {
        customer_id: 'CUST001',
        customer_name: '山田太郎',
        email: 'mail_1@example.com',
        phone: '09055556666',
        address: '東京都渋谷区',
        postal_code: '150-0001',
        created_at: '2024-01-15T10:20:00Z',
      },
      {
        customer_id: 'CUST001',
        customer_name: '山田太郎',
        email: 'mail_1@example.com',
        phone: '09011112222',
        address: '東京都渋谷区',
        postal_code: '150-0003',
        created_at: '2024-01-15T10:25:00Z',
      },
    ];

    const validationResult = detectInconsistenciesAndValidate(testDataset);

    expect(validationResult.inconsistency_logs).toHaveLength(6);

    expect(validationResult.inconsistency_logs[0]).toEqual({
      record_id: 0,
      error_type: 'メールアドレス不一致',
      field_name: 'email',
      conflicting_values: ['mail_1@example.com', 'mail_2@example.com'],
      severity_level: 'HIGH',
      detected_timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
    });

    expect(validationResult.inconsistency_logs[1]).toEqual({
      record_id: 1,
      error_type: 'メールアドレス不一致',
      field_name: 'email',
      conflicting_values: ['mail_2@example.com', 'mail_1@example.com'],
      severity_level: 'HIGH',
      detected_timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
    });

    expect(validationResult.inconsistency_logs[2]).toEqual({
      record_id: 2,
      error_type: '電話番号不一致',
      field_name: 'phone',
      conflicting_values: ['09011112222', '09033334444'],
      severity_level: 'HIGH',
      detected_timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
    });

    expect(validationResult.inconsistency_logs[3]).toEqual({
      record_id: 3,
      error_type: '郵便番号不一致',
      field_name: 'postal_code',
      conflicting_values: ['150-0001', '150-0002'],
      severity_level: 'HIGH',
      detected_timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
    });

    expect(validationResult.inconsistency_logs[4]).toEqual({
      record_id: 4,
      error_type: '電話番号不一致',
      field_name: 'phone',
      conflicting_values: ['09011112222', '09055556666'],
      severity_level: 'HIGH',
      detected_timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
    });

    expect(validationResult.inconsistency_logs[5]).toEqual({
      record_id: 5,
      error_type: '郵便番号不一致',
      field_name: 'postal_code',
      conflicting_values: ['150-0001', '150-0003'],
      severity_level: 'HIGH',
      detected_timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
    });

    expect(validationResult.validation_status).toBe('FAILED');
    expect(validationResult.total_issues_detected).toBe(6);
  });
});