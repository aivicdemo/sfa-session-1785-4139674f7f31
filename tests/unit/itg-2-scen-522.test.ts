import { detectAndMergeCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検知・統合判定機能', () => {
  // SCEN-522
  test('適用対象の正規化ルールが1件のとき、その1件が適用される', () => {
    const customerA = {
      customer_id: 'CUST001',
      customer_name: 'Customer A',
      phone_number: '+81-90-1234-5678',
    };

    const customerB = {
      customer_id: 'CUST002',
      customer_name: 'Customer B',
      phone_number: '+8190-1234-5678',
    };

    const normalizationRules = [
      {
        rule_id: 'NORM001',
        rule_name: '電話番号国番号削除ハイフン統一',
        target_field: 'phone_number',
        normalization_logic: (value: string): string => {
          return value.replace(/^\+81-?/, '').replace(/-/g, '-');
        },
        priority: 1,
        is_active: true,
      },
    ];

    const result = detectAndMergeCustomerDuplicates(
      [customerA, customerB],
      normalizationRules
    );

    expect(result.normalized_customers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          customer_id: 'CUST001',
          phone_number: '90-1234-5678',
        }),
        expect.objectContaining({
          customer_id: 'CUST002',
          phone_number: '90-1234-5678',
        }),
      ])
    );

    expect(result.duplicate_groups).toHaveLength(1);
    expect(result.duplicate_groups[0]).toEqual({
      primary_customer_id: 'CUST001',
      duplicate_customer_ids: ['CUST002'],
      matching_field: 'phone_number',
      normalized_value: '90-1234-5678',
    });

    expect(result.applied_rules).toContain('NORM001');
  });
});