import { normalizeCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化 - 正規化ルール未定義時のスキップ', () => {
  // SCEN-1057
  test('正規化ルールが未定義の場合、正規化処理がスキップされ、ログに記録される', () => {
    const customerData = {
      customerId: 'CUST-001',
      phoneNumber: '090-1234-5678',
      customerName: 'Test Customer',
    };

    const normalizationRules = [];

    const result = normalizeCustomerData(customerData, normalizationRules);

    expect(result.phoneNumber).toBe('090-1234-5678');
    expect(result.status).toBe('skipped');
    expect(result.processLog).toContain('正規化ルール未定義のためスキップ');
  });
});