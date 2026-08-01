import { evaluateSystemHealthCheck } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-248
  test('システムヘルスチェック判定機能 - 複数の営業データ品質スコアが全件合格のとき合格判定が出力される', () => {
    const salesDataQualityScores = [
      {
        id: 'quality_1',
        salesDataId: 'sales_data_001',
        score: 95,
        status: 'pass',
        timestamp: '2024-01-15T10:00:00Z'
      },
      {
        id: 'quality_2',
        salesDataId: 'sales_data_002',
        score: 92,
        status: 'pass',
        timestamp: '2024-01-15T10:05:00Z'
      },
      {
        id: 'quality_3',
        salesDataId: 'sales_data_003',
        score: 88,
        status: 'pass',
        timestamp: '2024-01-15T10:10:00Z'
      }
    ];

    const result = evaluateSystemHealthCheck(salesDataQualityScores);

    expect(result.status).toBe('pass');
    expect(result.message).toContain('全営業データ品質スコア：合格（3件/3件）');
    expect(result.totalCount).toBe(3);
    expect(result.passCount).toBe(3);
    expect(result.failCount).toBe(0);
  });
});