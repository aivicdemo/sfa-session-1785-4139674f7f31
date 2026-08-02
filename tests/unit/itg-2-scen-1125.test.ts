import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1125
  test('3つ以上の顧客データが存在する場合、すべての重複候補ペアが検出される', () => {
    const customerA = {
      id: 'A',
      name: '山田太郎',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
    };

    const customerB = {
      id: 'B',
      name: '山田太郎',
      phone: '090-1234-5678',
      address: '渋谷区東京都',
    };

    const customerC = {
      id: 'C',
      name: '太郎山田',
      phone: '090-1234-5679',
      address: '東京都渋谷区',
    };

    const customers = [customerA, customerB, customerC];

    const result = detectDuplicateCustomers(customers);

    expect(result.duplicatePairs.length).toBe(3);

    const pairAB = result.duplicatePairs.find(
      (pair) =>
        (pair.customerId1 === 'A' && pair.customerId2 === 'B') ||
        (pair.customerId1 === 'B' && pair.customerId2 === 'A')
    );
    expect(pairAB).toBeDefined();
    expect(pairAB?.matchReason).toContain('name');
    expect(pairAB?.matchReason).toContain('phone');
    expect(pairAB?.matchReason).toContain('address');

    const pairAC = result.duplicatePairs.find(
      (pair) =>
        (pair.customerId1 === 'A' && pair.customerId2 === 'C') ||
        (pair.customerId1 === 'C' && pair.customerId2 === 'A')
    );
    expect(pairAC).toBeDefined();
    expect(pairAC?.matchReason).toContain('name');
    expect(pairAC?.matchReason).toContain('address');

    const pairBC = result.duplicatePairs.find(
      (pair) =>
        (pair.customerId1 === 'B' && pair.customerId2 === 'C') ||
        (pair.customerId1 === 'C' && pair.customerId2 === 'B')
    );
    expect(pairBC).toBeDefined();
    expect(pairBC?.matchReason).toContain('name');
    expect(pairBC?.matchReason).toContain('address');
  });
});