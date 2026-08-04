import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  test('SCEN-1497: 品質スコア59で学習データ利用不可と判定される', () => {
    const mockLogger = {
      logs: [] as string[],
      log: function(message: string) {
        this.logs.push(message);
      }
    };

    const purchaseHistoryData = {
      customerId: 'CUST-001',
      purchaseRecords: [
        { date: '2024-01-15', amount: 50000, productId: 'PROD-A' },
        { date: '2024-02-20', amount: 75000, productId: 'PROD-B' },
        { date: '2024-03-10', amount: 60000, productId: 'PROD-A' }
      ],
      completenessScore: 85,
      consistencyScore: 75,
      accuracyScore: 48
    };

    const result = evaluatePurchaseHistoryDataQuality(
      purchaseHistoryData,
      { logger: mockLogger }
    );

    expect(result.qualityScore).toBe(59);
    expect(result.utilizable).toBe(false);
    expect(result.minThreshold).toBe(60);
    expect(result.reason).toContain('59');
    expect(result.reason).toContain('60');
    expect(result.reason).toContain('未満');

    const logMessages = mockLogger.logs.join(' ');
    expect(logMessages).toMatch(/品質スコア59/);
    expect(logMessages).toMatch(/閾値60/);
    expect(logMessages).toMatch(/学習データ/);
    expect(logMessages).toMatch(/利用不可/);
  });
});