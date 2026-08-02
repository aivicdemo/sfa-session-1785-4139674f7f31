import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-807
  test('正規化ルール「顧客名の大文字小文字統一」が適用され、データが統一される', () => {
    const input_customer_records = [
      {
        customer_id: 'CUST001',
        customer_name: 'ABC Corporation',
        created_at: new Date('2024-01-15T10:00:00Z')
      },
      {
        customer_id: 'CUST002',
        customer_name: 'abc corporation',
        created_at: new Date('2024-01-15T10:15:00Z')
      },
      {
        customer_id: 'CUST003',
        customer_name: 'Abc CORPORATION',
        created_at: new Date('2024-01-15T10:30:00Z')
      }
    ];

    const normalization_rule = {
      rule_id: 'RULE-CUST-001',
      rule_name: '顧客名の大文字小文字統一',
      rule_type: 'case_normalization',
      target_field: 'customer_name',
      normalization_pattern: 'lowercase',
      is_enabled: true,
      priority: 1
    };

    const result = detectDuplicateCustomers(
      input_customer_records,
      [normalization_rule]
    );

    expect(result.duplicate_groups_count).toBe(1);
    expect(result.merged_records_count).toBe(3);
    expect(result.duplicate_groups).toHaveLength(1);

    const first_duplicate_group = result.duplicate_groups[0];
    expect(first_duplicate_group.unified_customer_name).toBe('abc corporation');
    expect(first_duplicate_group.record_count).toBe(3);
    expect(first_duplicate_group.original_records).toHaveLength(3);
    expect(first_duplicate_group.original_records.map((r: any) => r.customer_id).sort()).toEqual(
      ['CUST001', 'CUST002', 'CUST003'].sort()
    );

    expect(result.message).toMatch(/3件のレコードが同一顧客として統一されました/);
  });
});