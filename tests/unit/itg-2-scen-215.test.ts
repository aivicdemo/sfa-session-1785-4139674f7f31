import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-215
  test('顧客IDが存在しないとき、重複検出がエラーになる', () => {
    const result = detectDuplicateCustomers({
      customerId: null,
      customerName: 'テスト顧客',
      email: 'test@example.com',
      phone: '09012345678',
    });

    expect(result.errorCode).toBe('CUSTOMER_ID_NOT_FOUND');
    expect(result.errorMessage).toMatch(/顧客IDが指定されていません/);
    expect(result.isDuplicate).toBeUndefined();
  });
});