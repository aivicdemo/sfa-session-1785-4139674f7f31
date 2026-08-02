import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-445
  test('住所が完全に一致する場合、重複と判定される', () => {
    const customerA = {
      id: 'CUST-001',
      name: '山田太郎',
      address: '東京都渋谷区道玄坂1-2-3 ビルディングA 5階',
      phone: '090-1234-5678',
    };

    const customerB = {
      id: 'CUST-002',
      name: '山田花子',
      address: '東京都渋谷区道玄坂1-2-3 ビルディングA 5階',
      phone: '090-9876-5432',
    };

    const result = detectDuplicateCustomers(customerA, customerB);

    expect(result.status).toBe('DUPLICATE');
    expect(result.matchFactor).toBe('address_full_match');
  });
});