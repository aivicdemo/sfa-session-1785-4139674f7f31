import { evaluateOperationalTransactionDataQuality } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業トランザクションデータ品質評価', () => {
  // SCEN-443
  test('営業トランザクションのエラー件数が複数件の場合、件数に応じたスコアが算出される', () => {
    const transactionData = {
      transactionId: 'TXN-20240115-001',
      customerId: 'CUST-12345',
      dealAmount: 1500000,
      dealStage: 'negotiation',
      proposalDate: '2024-01-15',
      createdAt: '2024-01-15T10:00:00Z',
    };

    const detectedErrors = [
      {
        errorId: 'ERR-001',
        errorType: 'データ型不正',
        severity: 'high',
        field: 'dealAmount',
      },
      {
        errorId: 'ERR-002',
        errorType: '必須項目欠落',
        severity: 'medium',
        field: 'dealDescription',
      },
      {
        errorId: 'ERR-003',
        errorType: '形式不正',
        severity: 'low',
        field: 'proposalDate',
      },
    ];

    const result = evaluateOperationalTransactionDataQuality(
      transactionData,
      detectedErrors
    );

    const expectedScore = 65;
    expect(result.qualityScore).toBe(expectedScore);
    expect(result.qualityScore).toBeGreaterThanOrEqual(0);
    expect(result.qualityScore).toBeLessThanOrEqual(100);
    expect(Number.isInteger(result.qualityScore)).toBe(true);
    expect(result.errorCount).toBe(3);
    expect(result.baseScore).toBe(100);
  });
});