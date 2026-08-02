import { integrateAndRecordPurchaseData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-988
  test('データ不整合ログが0件記録される場合でも処理は続行される', async () => {
    const purchaseData = {
      customerId: 'CUST-12345',
      amount: 150000,
      purchaseDate: '2024-01-15T10:30:00Z',
      productId: 'PROD-789',
      quantity: 2,
    };

    const result = await integrateAndRecordPurchaseData(purchaseData);

    expect(result.status).toBe('success');
    expect(result.integratedData).toEqual({
      customerId: 'CUST-12345',
      amount: 150000,
      purchaseDate: '2024-01-15T10:30:00Z',
      productId: 'PROD-789',
      quantity: 2,
    });
    expect(result.inconsistencyLogsCount).toBe(0);
    expect(result.isDataSaved).toBe(true);
  });
});