import { executeSystemHealthCheck } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-241: [normal] システムヘルスチェック判定機能 - 複数の営業データ品質指標があるとき全件がレポートに含まれる
  test('should include all data quality indicators in health check report with correct scores', () => {
    const dataQualityIndicators = [
      {
        indicatorId: 'QI-001',
        qualityScore: 85,
      },
      {
        indicatorId: 'QI-002',
        qualityScore: 72,
      },
      {
        indicatorId: 'QI-003',
        qualityScore: 91,
      },
    ];

    const systemHealthCheckInput = {
      dataQualityIndicators: dataQualityIndicators,
    };

    const report = executeSystemHealthCheck(systemHealthCheckInput);

    expect(report.dataQualityIndicators).toBeDefined();
    expect(report.dataQualityIndicators).toHaveLength(3);

    expect(report.dataQualityIndicators[0].indicatorId).toBe('QI-001');
    expect(report.dataQualityIndicators[0].qualityScore).toBe(85);

    expect(report.dataQualityIndicators[1].indicatorId).toBe('QI-002');
    expect(report.dataQualityIndicators[1].qualityScore).toBe(72);

    expect(report.dataQualityIndicators[2].indicatorId).toBe('QI-003');
    expect(report.dataQualityIndicators[2].qualityScore).toBe(91);

    const indicatorIds = report.dataQualityIndicators.map(
      (indicator: { indicatorId: string; qualityScore: number }) =>
        indicator.indicatorId
    );
    expect(indicatorIds).toContain('QI-001');
    expect(indicatorIds).toContain('QI-002');
    expect(indicatorIds).toContain('QI-003');
  });
});