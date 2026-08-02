import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1102
  test('電話番号が空文字列のとき、他の属性で重複判定が進行する', () => {
    const customerA = {
      name: '田中太郎',
      email: 'tanaka@example.com',
      address: '東京都渋谷区',
      phone: ''
    };

    const customerB = {
      name: '田中太郎',
      email: 'tanaka@example.com',
      address: '東京都渋谷区',
      phone: ''
    };

    const result = detectDuplicateCustomers(customerA, customerB);

    expect(result.isDuplicate).toBe(true);
    expect(result.matchedAttributes).toEqual(['name', 'email', 'address']);
    expect(result.matchScore).toBe(100);
  });
});