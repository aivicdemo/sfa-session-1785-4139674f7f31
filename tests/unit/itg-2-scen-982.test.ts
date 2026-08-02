import { recordPurchaseAndIntegrate } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-982
  test('正規化ルールが0件の場合でも購買データが記録される', async () => {
    const input = {
      customerId: 'CUST001',
      productId: 'PROD123',
      purchaseAmount: 50000,
      purchaseDateTime: '2024-01-15T10:30:00Z',
      normalizationRules: [] as any[],
    };

    const beforeTimestamp = Date.now();
    const result = await recordPurchaseAndIntegrate(input);
    const afterTimestamp = Date.now();

    expect(result.purchaseRecord).toBeDefined();
    expect(result.purchaseRecord.customerId).toBe('CUST001');
    expect(result.purchaseRecord.productId).toBe('PROD123');
    expect(result.purchaseRecord.purchaseAmount).toBe(50000);
    expect(result.purchaseRecord.purchaseDateTime).toBe('2024-01-15T10:30:00Z');
    expect(result.purchaseRecord.recordStatus).toBe('成功');

    expect(result.integratedDataCache).toBeDefined();
    expect(result.integratedDataCache.customerId).toBe('CUST001');

    const cacheUpdateTimestamp = new Date(result.integratedDataCache.lastUpdatedAt).getTime();
    const timeDiffMs = Math.abs(cacheUpdateTimestamp - beforeTimestamp);
    expect(timeDiffMs).toBeLessThanOrEqual(5000);
  });
});