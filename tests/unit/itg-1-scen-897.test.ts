import { analyzeTeamSalesQualityStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能', () => {
  // SCEN-897
  test('チーム平均フォローアップ成功率がNaN（非数値）のとき、エラーになる', () => {
    const invalidTeamData = {
      averageFollowUpSuccessRate: NaN,
      totalFollowUpAttempts: 150,
      successfulFollowUps: 120,
      averageProposalAcceptanceRate: 0.65,
      deviationFromStandardProcess: 0.12,
      teamSize: 5,
      analysisMonth: '2024-01',
    };

    expect(() => analyzeTeamSalesQualityStatistics(invalidTeamData)).toThrow(
      /チーム平均フォローアップ成功率が有効な数値/
    );
  });
});