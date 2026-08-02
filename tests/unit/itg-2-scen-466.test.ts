import { detectCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検出と統合判定', () => {
  // SCEN-466
  test('重複判定の履歴が記録される', () => {
    const customerA = {
      customerId: 'CUST001',
      name: '山田太郎',
      email: 'yamada@example.com',
    };

    const customerB = {
      customerId: 'CUST002',
      name: '山田太郎',
      email: 'yamada@example.com',
    };

    const fixedTimestamp = new Date('2024-01-15T10:30:00Z');

    const result = detectCustomerDuplicates(
      [customerA, customerB],
      fixedTimestamp,
      'system'
    );

    expect(result.duplicateHistory).toHaveLength(1);
    expect(result.duplicateHistory[0]).toEqual({
      judgedAt: fixedTimestamp,
      customerId1: 'CUST001',
      customerId2: 'CUST002',
      judgeReason: '名前とメールアドレスが完全一致',
      judgeStatus: '重複候補',
      executedByUser: 'system',
    });
  });
});