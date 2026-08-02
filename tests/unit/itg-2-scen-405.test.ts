import { detectCustomerDuplicateAndMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-405: [normal] 顧客データ重複検出と統合判定機能 - 不整合検出が0件の場合、不整合なしとして報告される', () => {
    // テスト用の顧客データセット
    const customer_records = [
      {
        customer_id: 'CUST001',
        customer_name: '山田太郎',
        email: 'yamada@example.com',
        phone: '09012345678',
        address: '東京都渋谷区',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T11:00:00Z',
      },
      {
        customer_id: 'CUST002',
        customer_name: '鈴木花子',
        email: 'suzuki@example.com',
        phone: '09087654321',
        address: '東京都新宿区',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-15T11:00:00Z',
      },
      {
        customer_id: 'CUST003',
        customer_name: '佐藤次郎',
        email: 'sato@example.com',
        phone: '09011111111',
        address: '東京都中野区',
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-15T11:00:00Z',
      },
    ];

    const merge_rules = {
      name_matching_threshold: 0.85,
      email_exact_match: true,
      phone_exact_match: true,
      dedup_priority: 'created_at_asc',
    };

    const validation_rules = {
      required_fields: ['customer_id', 'customer_name', 'email'],
      phone_format_regex: '^\\d{10,11}$',
      email_format_regex: '^[^@]+@[^@]+\\.[^@]+$',
    };

    const result = detectCustomerDuplicateAndMerge({
      customer_records,
      merge_rules,
      validation_rules,
      inconsistency_count: 0,
    });

    expect(result.inconsistency_count).toBe(0);
    expect(result.inconsistency_status).toBe('なし');
    expect(result.inconsistency_details).toEqual([]);
    expect(result.merge_judgment_status).toBe('完了');
    expect(result.report).toStrictEqual({
      total_records_processed: 3,
      duplicate_pairs_detected: 0,
      merged_record_count: 0,
      inconsistency_detected: false,
      inconsistency_details: [],
      processing_timestamp: expect.any(String),
    });
  });
});