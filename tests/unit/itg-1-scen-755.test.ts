import { selectAnalysisMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析対象指標の自動選定', () => {
  // SCEN-755
  test('営業プロセス標準書と成約実績の相関係数が0に近い指標は優先度が低くなる', () => {
    const metrics = [
      {
        metricId: 'metric_A',
        metricName: '指標A',
        correlationWithRevenue: 0.8,
      },
      {
        metricId: 'metric_B',
        metricName: '指標B',
        correlationWithRevenue: 0.5,
      },
      {
        metricId: 'metric_C',
        metricName: '指標C',
        correlationWithRevenue: 0.05,
      },
    ];

    const result = selectAnalysisMetrics(metrics);

    expect(result).toEqual({
      selectedMetrics: [
        {
          metricId: 'metric_A',
          metricName: '指標A',
          correlationWithRevenue: 0.8,
          priorityScore: 100,
          rank: 1,
        },
        {
          metricId: 'metric_B',
          metricName: '指標B',
          correlationWithRevenue: 0.5,
          priorityScore: 62.5,
          rank: 2,
        },
        {
          metricId: 'metric_C',
          metricName: '指標C',
          correlationWithRevenue: 0.05,
          priorityScore: 6.25,
          rank: 3,
        },
      ],
      analysisStarted: true,
    });

    expect(result.selectedMetrics[0].priorityScore).toBeGreaterThan(
      result.selectedMetrics[1].priorityScore
    );
    expect(result.selectedMetrics[1].priorityScore).toBeGreaterThan(
      result.selectedMetrics[2].priorityScore
    );
    expect(result.selectedMetrics[2].priorityScore).toBeLessThanOrEqual(
      result.selectedMetrics[0].priorityScore * 0.1
    );
  });
});