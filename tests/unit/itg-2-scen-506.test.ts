import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-506
  test('顧客電話番号が欠落しているとき、他の判定基準で重複判定が継続される', () => {
    const customerDataA = {
      id: 'CUST_001',
      name: '山田太郎',
      address: '東京都渋谷区',
      email: 'yamada@example.com',
      phone: '',
    };

    const customerDataB = {
      id: 'CUST_002',
      name: '山田太郎',
      address: '東京都渋谷区',
      email: 'yamada@example.com',
      phone: '',
    };

    const result = detectDuplicateCustomers(customerDataA, customerDataB);

    expect(result.isDuplicate).toBe(true);
    expect(result.canMerge).toBe(true);
    expect(result.matchingFields).toEqual(['name', 'address', 'email']);
    expect(result.matchingFieldCount).toBe(3);
  });
});