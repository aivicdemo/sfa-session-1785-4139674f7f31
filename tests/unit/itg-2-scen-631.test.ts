import { mergeCustomerRecords } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-631: 正規化ルール適用がない項目は元の値が保持される', () => {
    const record1 = {
      customer_id: 'CUST001',
      customer_name: 'テスト顧客A',
      email: '  test@example.com  ',
      phone: '090-1234-5678',
      notes: '  重要顧客  ',
      external_system_id: 'A00123',
      address: '東京都渋谷区',
      industry: 'IT',
      employee_count: 50,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    };

    const record2 = {
      customer_id: 'CUST002',
      customer_name: 'テスト顧客A',
      email: 'test@example.com',
      phone: '090-1234-5678',
      notes: '  重要顧客  ',
      external_system_id: 'A00123',
      address: '東京都渋谷区',
      industry: 'IT',
      employee_count: 50,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-15T11:00:00Z'
    };

    const normalization_rules = [
      {
        field_name: 'email',
        rule_type: 'trim',
        priority: 1
      },
      {
        field_name: 'customer_name',
        rule_type: 'uppercase',
        priority: 2
      }
    ];

    const merged_record = mergeCustomerRecords([record1, record2], normalization_rules);

    expect(merged_record.notes).toBe('  重要顧客  ');
    expect(merged_record.external_system_id).toBe('A00123');
    expect(merged_record.email).toBe('test@example.com');
    expect(merged_record.customer_name).toBe('テスト顧客A');
  });
});