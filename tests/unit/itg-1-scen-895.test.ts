import { analyzeTeamSalesQualityMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能', () => {
  // SCEN-895
  test('チーム平均成約率がNaN（非数値）のとき、エラーになる', () => {
    const input = {
      teamAverageClosureRate: NaN,
      teamAverageProposaAccuracyRate: 0.85,
      teamAverageFollowUpSuccessRate: 0.78,
      analysisMonths: 3,
      targetClosureRate: 0.75,
    };

    expect(() => analyzeTeamSalesQualityMetrics(input)).toThrow(/チーム平均成約率が有効な数値ではありません/);
  });
});