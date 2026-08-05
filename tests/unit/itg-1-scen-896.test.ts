import { analyzeTeamSalesQualityStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能', () => {
  // SCEN-896
  test('チーム平均提案精度がNaN（非数値）のとき、エラーになる', () => {
    const input = {
      teamAverageProposeAccuracy: NaN,
      teamAverageFollowupSuccessRate: 0.75,
      teamAverageContractRate: 0.65,
      analysisMonths: 3,
      targetProcessComplianceRate: 0.90,
    };

    expect(() => analyzeTeamSalesQualityStatistics(input)).toThrow(
      /チーム平均提案精度が数値ではありません/
    );
  });
});