import { evaluateSystemHealth } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-216
  test('システムヘルスチェック判定機能 - システム稼働状況が合格基準を下回るとき不合格判定が出力される', () => {
    const systemMetrics = {
      cpuUsagePercent: 95,
      memoryUsagePercent: 92,
      diskUsagePercent: 88,
      responseTimeMs: 5000,
    };

    const result = evaluateSystemHealth(systemMetrics);

    expect(result.status).toBe('FAILED');
    expect(result.overallResult).toBe('不合格');
    expect(result.details).toContain('CPU使用率が閾値(90%)を超過');
    expect(result.details).toContain('メモリ使用率が閾値(85%)を超過');
    expect(result.details).toContain('ディスク使用率が閾値(80%)を超過');
    expect(result.details).toContain('レスポンスタイムが閾値(3000ms)を超過');
  });
});