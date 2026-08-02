import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化 - 異なる顧客名を持つ2件の顧客データが重複候補として検出されない', () => {
  // SCEN-1035
  test('should not detect duplicate when customer names differ', () => {
    const customerA = {
      customerId: 'C001',
      customerName: '山田太郎',
      phone: '090-1111-1111',
      address: '東京都渋谷区',
    };

    const customerB = {
      customerId: 'C002',
      customerName: '山田次郎',
      phone: '090-1111-1111',
      address: '東京都渋谷区',
    };

    const result = detectDuplicateCustomers([customerA, customerB]);

    expect(result).toEqual([]);
  });
});