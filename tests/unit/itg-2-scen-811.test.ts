import { detectDuplicateAndInconsistency } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-811
  test('顧客名が空文字列の場合、検出処理がエラーになる', () => {
    const invalidInput = {
      customerId: 'CUST-001',
      customerName: '',
      email: 'test@example.com',
      phone: '09012345678',
      address: '東京都渋谷区'
    };

    expect(() => detectDuplicateAndInconsistency(invalidInput)).toThrow(/顧客名/);
  });
});