import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-858
  test('重複判定ロジックの入力項目である住所が欠けているとき、処理は失敗する', () => {
    const customerData = {
      customer_name: '田中太郎',
      phone_number: '090-1234-5678',
      email_address: 'tanaka@example.com',
      address: ''
    };

    expect(() => detectDuplicateCustomers(customerData)).toThrow(/ADDRESS_REQUIRED/);
  });
});