import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-213
  test('住所が空のとき、重複判定がスキップされる', () => {
    const customerA = {
      customer_id: 'CUST001',
      customer_name: '株式会社テスト',
      email: 'test@example.com',
      address: '',
      phone: '09012345678',
      registration_date: new Date('2024-01-15T10:00:00Z'),
    };

    const customerB = {
      customer_id: 'CUST002',
      customer_name: '株式会社テスト',
      email: 'test@example.com',
      address: '東京都渋谷区1-2-3',
      phone: '09087654321',
      registration_date: new Date('2024-01-16T10:00:00Z'),
    };

    const result = detectDuplicateCustomers(customerA, customerB);

    expect(result).toEqual({
      is_duplicate: false,
      reason: '住所が空のため重複判定をスキップ',
      skip_flag: true,
    });
  });
});