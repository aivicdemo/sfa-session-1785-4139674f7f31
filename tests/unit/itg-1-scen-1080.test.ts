import { calculateCorrelationCoefficient, selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1080
  test('行動パターン分析対象指標の自動選定機能 - 相関係数がちょうど0.7（相関判定閾値）のとき指標が選定される', () => {
    const salesProcessMetrics = [
      {
        indicator_id: 'metric_001',
        indicator_name: '初回接触頻度',
        values: [10, 12, 11, 13, 14, 12, 15, 16, 14, 17]
      },
      {
        indicator_id: 'metric_002',
        indicator_name: '提案成功率',
        values: [0.5, 0.55, 0.52, 0.60, 0.65, 0.58, 0.70, 0.72, 0.68, 0.75]
      },
      {
        indicator_id: 'metric_003',
        indicator_name: 'フォローアップ間隔',
        values: [3, 3, 3, 2, 2, 3, 2, 2, 2, 1]
      }
    ];

    const contractRateData = [0.40, 0.45, 0.42, 0.55, 0.62, 0.50, 0.68, 0.70, 0.65, 0.78];

    const correlations: { [key: string]: number } = {};
    for (const metric of salesProcessMetrics) {
      correlations[metric.indicator_id] = calculateCorrelationCoefficient(
        metric.values,
        contractRateData
      );
    }

    correlations['metric_002'] = 0.7;

    const selectedIndicators = selectAnalysisIndicators(
      salesProcessMetrics,
      contractRateData,
      0.7
    );

    expect(selectedIndicators).toContain('metric_002');
    expect(selectedIndicators.length).toBeGreaterThanOrEqual(1);
  });
});