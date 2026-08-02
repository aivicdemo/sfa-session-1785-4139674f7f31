import { detectDuplicateAndInconsistency } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出エンジン', () => {
  // SCEN-362
  test('不整合パターンが0個検出された場合、不整合ログが生成されない', () => {
    const customerDataset = [
      {
        customer_id: 'CUST001',
        customer_name: 'テスト太郎',
        email: 'taro@example.com',
        phone: '09012345678',
        company_name: 'テスト会社',
        postal_code: '100-0001',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        customer_id: 'CUST002',
        customer_name: 'テスト花子',
        email: 'hanako@example.com',
        phone: '09087654321',
        company_name: 'テスト花子社',
        postal_code: '100-0002',
        created_at: '2024-01-02T10:00:00Z',
        updated_at: '2024-01-16T10:00:00Z'
      }
    ];

    const result = detectDuplicateAndInconsistency({
      customer_dataset: customerDataset,
      duplicate_detection_rules: [
        {
          rule_id: 'RULE001',
          name: '名義重複チェック',
          target_fields: ['customer_name', 'company_name'],
          match_type: 'exact',
          priority: 1
        }
      ],
      inconsistency_detection_rules: [
        {
          rule_id: 'RULE002',
          name: 'メールフォーマット検証',
          target_field: 'email',
          validation_type: 'email_format',
          priority: 1
        }
      ],
      quality_threshold: 0.95
    });

    expect(result.total_inconsistency_count).toBe(0);
    expect(result.inconsistency_logs).toEqual([]);
    expect(result.inconsistency_log_generated).toBe(false);
  });
});