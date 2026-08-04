import { verifyRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-395: [edge] 推論精度検証機能 - 実績値データが欠落している推奨履歴が含まれるとき、該当レコードを精度計測から除外
  test('should exclude recommendation records with missing actual results from accuracy calculation', () => {
    const recommendationHistoryDataset = [
      {
        id: 'rec_001',
        recommendedContent: '提案A',
        recommendedAt: new Date('2026-01-10T10:00:00Z'),
        actualSalesAmount: 1000000,
        contractDate: new Date('2026-01-15T15:00:00Z'),
      },
      {
        id: 'rec_002',
        recommendedContent: '提案B',
        recommendedAt: new Date('2026-01-12T10:00:00Z'),
        actualSalesAmount: null,
        contractDate: null,
      },
      {
        id: 'rec_003',
        recommendedContent: '提案C',
        recommendedAt: new Date('2026-01-18T10:00:00Z'),
        actualSalesAmount: 2500000,
        contractDate: new Date('2026-01-20T15:00:00Z'),
      },
    ];

    const result = verifyRecommendationAccuracy(recommendationHistoryDataset);

    expect(result.measuredRecordCount).toBe(2);
    expect(result.usedRecordIds).toEqual(['rec_001', 'rec_003']);
    expect(result.excludedRecordIds).toEqual(['rec_002']);
  });
});