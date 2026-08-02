import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-264
  test('データ品質ルールが欠けているとき、品質検証処理がエラーになる', () => {
    const customerData = [
      {
        customerId: 'CUST001',
        customerName: 'Example Corp',
        email: 'contact@example.com',
        phone: '090-1234-5678',
        address: 'Tokyo, Japan'
      },
      {
        customerId: 'CUST002',
        customerName: 'Example Corporation',
        email: 'info@example.com',
        phone: '090-1234-5678',
        address: 'Tokyo, Japan'
      }
    ];

    const emptyQualityRules = [];

    expect(() => {
      detectDuplicateCustomers(customerData, emptyQualityRules);
    }).toThrow(/ルール定義/);
  });
});