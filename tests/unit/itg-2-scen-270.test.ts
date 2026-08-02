import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 標準プロセス遵守度スコア計算', () => {
  // SCEN-270
  test('商談記録が0件のとき、スコア計算が実行されず空結果が返される', () => {
    const input = {
      salesRepId: 'REP-001',
      periodStart: new Date('2024-01-01T00:00:00Z'),
      periodEnd: new Date('2024-01-31T23:59:59Z'),
      dealRecords: [],
    };

    const result = calculateProcessComplianceScore(input);

    expect(result).toEqual({
      salesRepId: 'REP-001',
      complianceScore: null,
      deviationPatterns: [],
      calculationExecuted: false,
      processedRecordCount: 0,
    });
  });
});