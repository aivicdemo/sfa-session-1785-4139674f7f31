import { detectDuplicateCustomersAndRecordMergeHistory } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-169
  test('統合判定履歴に使用された名寄せ基準ルールIDが記録される', () => {
    const recordA = {
      customer_id: 'CUST-001',
      name: '株式会社テスト',
      email: 'test@example.com',
      phone: '03-1234-5678',
      address: '東京都渋谷区',
      created_at: new Date('2024-01-15T10:00:00Z'),
      updated_at: new Date('2024-01-15T10:00:00Z'),
    };

    const recordB = {
      customer_id: 'CUST-002',
      name: 'テスト株式会社',
      email: 'test@example.com',
      phone: '03-1234-5678',
      address: '東京都渋谷区',
      created_at: new Date('2024-01-15T10:00:00Z'),
      updated_at: new Date('2024-01-15T10:00:00Z'),
    };

    const rule_id = 'RULE-001';

    const result = detectDuplicateCustomersAndRecordMergeHistory({
      customerRecords: [recordA, recordB],
      ruleId: rule_id,
      mergeConfirmed: true,
    });

    expect(result.mergeHistory).toBeDefined();
    expect(result.mergeHistory.used_rule_id).toBe('RULE-001');
    expect(result.mergeHistory.primary_customer_id).toBe('CUST-001');
    expect(result.mergeHistory.secondary_customer_id).toBe('CUST-002');
    expect(result.mergeHistory.merge_status).toBe('confirmed');
    expect(result.isDuplicate).toBe(true);
  });
});