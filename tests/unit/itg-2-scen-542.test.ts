import { detectAndClassifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検出・分類機能', () => {
  test('SCEN-542: 正規化ルール1件のとき、該当する不整合データにそのルールを適用する', () => {
    // Setup: 正規化ルール1件（電話番号フォーマット統一）
    const normalization_rules = [
      {
        rule_id: 'NORM_PHONE_001',
        rule_name: '電話番号フォーマット統一',
        data_field: 'phone_number',
        normalization_pattern: 'REMOVE_HYPHENS',
        target_format: '\\d{10,11}',
        priority: 1,
        is_active: true,
      },
    ];

    // Setup: 該当する不整合データ（電話番号フォーマット異なる2件）
    const customer_data = [
      {
        customer_id: 'CUST_001',
        customer_name: '山田太郎',
        phone_number: '090-1234-5678',
        email: 'yamada@example.com',
        address: '東京都渋谷区',
      },
      {
        customer_id: 'CUST_002',
        customer_name: '山田太郎',
        phone_number: '09012345678',
        email: 'yamada@example.com',
        address: '東京都渋谷区',
      },
    ];

    // Execute
    const result = detectAndClassifyDuplicateCustomers(
      customer_data,
      normalization_rules
    );

    // Assert: 正規化ルール適用後、2件が同一顧客と判定される
    expect(result.normalized_data).toEqual([
      {
        customer_id: 'CUST_001',
        customer_name: '山田太郎',
        phone_number: '09012345678',
        email: 'yamada@example.com',
        address: '東京都渋谷区',
      },
      {
        customer_id: 'CUST_002',
        customer_name: '山田太郎',
        phone_number: '09012345678',
        email: 'yamada@example.com',
        address: '東京都渋谷区',
      },
    ]);

    // Assert: 重複検出結果で2件が同一顧客グループとして分類される
    expect(result.duplicate_groups).toHaveLength(1);
    expect(result.duplicate_groups[0].customer_ids).toEqual([
      'CUST_001',
      'CUST_002',
    ]);
    expect(result.duplicate_groups[0].match_reason).toBe('phone_number');
    expect(result.duplicate_groups[0].confidence_score).toBeGreaterThanOrEqual(
      0.95
    );

    // Assert: 実行結果ログに正規化ルール適用が記録される
    expect(result.execution_log).toContainEqual(
      expect.objectContaining({
        action: 'NORMALIZATION_APPLIED',
        rule_id: 'NORM_PHONE_001',
        field: 'phone_number',
        processed_records: 2,
      })
    );
  });
});