import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化 - 重複候補検出', () => {
  test('SCEN-1041: 3件以上の顧客データから全組み合わせを比較して重複候補を検出', () => {
    const customerA = {
      customerId: 'CUST-001',
      name: '山田太郎',
      phone: '090-1111-1111',
      address: '東京都渋谷区',
    };

    const customerB = {
      customerId: 'CUST-002',
      name: '山田太郎',
      phone: '090-1111-1111',
      address: '東京都渋谷区',
    };

    const customerC = {
      customerId: 'CUST-003',
      name: '山田次郎',
      phone: '090-2222-2222',
      address: '東京都渋谷区',
    };

    const customers = [customerA, customerB, customerC];

    const result = detectDuplicateCustomers(customers);

    expect(result.comparisonCount).toBe(3);
    expect(result.duplicateCandidates).toHaveLength(1);
    expect(result.duplicateCandidates[0]).toEqual({
      customerId1: 'CUST-001',
      customerId2: 'CUST-002',
      matchPercentage: 100,
      matchingFields: ['name', 'phone', 'address'],
    });
  });
});