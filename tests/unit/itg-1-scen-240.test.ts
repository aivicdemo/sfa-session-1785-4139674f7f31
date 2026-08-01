import { generateSystemHealthReport } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-240: システムヘルスチェック判定機能 - 複数のシステム稼働状況メトリクスがあるとき全件がレポートに含まれる', () => {
    // Arrange: 3件のシステム稼働状況メトリクスを準備
    const metrics = [
      {
        metric_id: 'cpu_usage',
        metric_name: 'CPU使用率',
        value: 75,
        unit: '%',
        threshold: 80,
        status: 'normal',
        timestamp: new Date('2024-01-15T11:00:00Z'),
      },
      {
        metric_id: 'memory_usage',
        metric_name: 'メモリ使用率',
        value: 82,
        unit: '%',
        threshold: 85,
        status: 'normal',
        timestamp: new Date('2024-01-15T11:00:00Z'),
      },
      {
        metric_id: 'disk_usage',
        metric_name: 'ディスク使用率',
        value: 45,
        unit: '%',
        threshold: 90,
        status: 'normal',
        timestamp: new Date('2024-01-15T11:00:00Z'),
      },
    ];

    // Act: システムヘルスチェック判定機能でレポート生成を実行
    const report = generateSystemHealthReport(metrics);

    // Assert: 生成されたレポートに3件すべてのメトリクスが含まれていることを検証
    expect(report.metrics_count).toBe(3);
    expect(report.metrics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metric_id: 'cpu_usage',
          metric_name: 'CPU使用率',
          value: 75,
          unit: '%',
        }),
        expect.objectContaining({
          metric_id: 'memory_usage',
          metric_name: 'メモリ使用率',
          value: 82,
          unit: '%',
        }),
        expect.objectContaining({
          metric_id: 'disk_usage',
          metric_name: 'ディスク使用率',
          value: 45,
          unit: '%',
        }),
      ])
    );
    expect(report.report_generated_at).toBeDefined();
    expect(report.overall_status).toBe('normal');
  });
});