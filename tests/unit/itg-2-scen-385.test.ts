import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-385
  test('電話番号のハイフンが異なる場合、同一として判定される', () => {
    const customerA = {
      id: 'cust_001',
      name: '山田太郎',
      phone: '090-1234-5678',
      email: 'yamada@example.com',
      address: '東京都渋谷区'
    };

    const customerB = {
      id: 'cust_002',
      name: '山田太郎',
      phone: '09012345678',
      email: 'yamada@example.com',
      address: '東京都渋谷区'
    };

    const result = detectDuplicateCustomers(customerA, customerB);

    expect(result.duplicate).toBe(true);
    expect(result.matchedField).toEqual(['phone']);
    expect(result.duplicateScore).toBeGreaterThanOrEqual(0.8);
  });
});