import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-449
  test('メールアドレスが完全に一致する場合、重複と判定される', () => {
    const customerA = {
      name: '田中太郎',
      email: 'tanaka@example.com',
      phone: '090-1234-5678',
    };

    const customerB = {
      name: '田中次郎',
      email: 'tanaka@example.com',
      phone: '090-9876-5432',
    };

    const result = detectDuplicateCustomers(customerA, customerB);

    expect(result.isDuplicate).toBe(true);
    expect(result.reason).toBe('メールアドレスが完全一致');
  });
});