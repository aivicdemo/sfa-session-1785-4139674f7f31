import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化', () => {
  // SCEN-1034
  test('同一の顧客名と住所を持つ2件の顧客データが重複候補として検出される', () => {
    const customer1 = {
      customerId: 'C001',
      name: '山田太郎',
      address: '東京都渋谷区道玄坂1-2-3',
      phone: '09012345678',
    };

    const customer2 = {
      customerId: 'C002',
      name: '山田太郎',
      address: '東京都渋谷区道玄坂1-2-3',
      phone: '09087654321',
    };

    const customers = [customer1, customer2];

    const result = detectDuplicateCustomers(customers);

    expect(result.duplicateCandidates).toHaveLength(1);
    expect(result.duplicateCandidates[0]).toEqual({
      customerIdPair: ['C001', 'C002'],
      matchReason: '顧客名と住所が完全一致',
      duplicateScore: expect.any(Number),
    });
    expect(result.duplicateCandidates[0].duplicateScore).toBeGreaterThanOrEqual(95);
  });
});