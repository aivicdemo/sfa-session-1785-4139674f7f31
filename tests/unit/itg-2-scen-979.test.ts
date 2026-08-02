import { recordPurchaseResult } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-979
  test('購買結果記録・営業データ統合機能 - 購買結果の品質検証ルールが0件の場合でも記録される', async () => {
    const fetchMock = require('jest-fetch-mock');
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    const purchaseResultData = {
      customer_id: 'CUST001',
      product_code: 'PROD-A',
      purchase_amount: 50000,
      purchase_datetime: '2024-01-15T10:30:00Z',
      validation_rules: []
    };

    const mockRecordId = 'REC-20240115-001';
    const mockCreatedAt = '2024-01-15T10:30:00Z';

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: 200,
        record_id: mockRecordId,
        customer_id: 'CUST001',
        product_code: 'PROD-A',
        purchase_amount: 50000,
        purchase_datetime: '2024-01-15T10:30:00Z',
        created_at: mockCreatedAt
      }),
      { status: 200 }
    );

    const result = await recordPurchaseResult(purchaseResultData);

    expect(result.status).toBe(200);
    expect(result.record_id).toBe(mockRecordId);
    expect(result.customer_id).toBe('CUST001');
    expect(result.product_code).toBe('PROD-A');
    expect(result.purchase_amount).toBe(50000);
    expect(result.purchase_datetime).toBe('2024-01-15T10:30:00Z');
    expect(result.created_at).toBe(mockCreatedAt);
  });
});