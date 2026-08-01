import { calculateSystemHealthCheckResult } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-231: [edge] システムヘルスチェック判定機能 - 営業データの品質スコアが0のとき不合格判定が出力される', () => {
    const input = {
      systemOperationalStatus: 'healthy',
      operationalStatusScore: 95,
      salesDataQualityScore: 0,
      qualityScoreThreshold: 80,
      aiInferenceAccuracyScore: 92,
      inferenceAccuracyThreshold: 85,
      checkTimestamp: '2024-01-15T11:00:00Z',
    };

    const result = calculateSystemHealthCheckResult(input);

    expect(result.status).toBe('failed');
    expect(result.details).toContain('営業データ品質スコア: 0 - 基準値未満');
  });
});