import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と統合判定機能', () => {
  // SCEN-383
  test('顧客名が異なる場合、重複候補に含められない', () => {
    const recordA = {
      customerId: 'C001',
      customerName: '山田太郎',
      email: 'yamada@example.com',
      phoneNumber: '09012345678',
    };

    const recordB = {
      customerId: 'C002',
      customerName: '佐藤次郎',
      email: 'yamada@example.com',
      phoneNumber: '09012345678',
    };

    const customers = [recordA, recordB];

    const result = detectDuplicateCustomers(customers);

    expect(result.duplicateCandidates).toEqual([]);
    expect(result.excludedPairs).toContainEqual(
      expect.objectContaining({
        recordIdA: 'C001',
        recordIdB: 'C002',
        reason: 'customerName',
      })
    );
  });
});