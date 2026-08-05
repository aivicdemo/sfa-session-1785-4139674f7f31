import { analyzeTeamSalesQualityStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能', () => {
  test('SCEN-877: 分析対象期間のデータが完全に欠落しているときエラーになる', () => {
    const analysisParams = {
      analysisStartDate: new Date('2024-10-15T00:00:00Z'),
      analysisEndDate: new Date('2024-01-15T23:59:59Z'),
      targetSalesActivities: [],
      targetContracts: [],
      targetProposals: [],
    };

    expect(() => analyzeTeamSalesQualityStatistics(analysisParams)).toThrow(
      /分析対象期間/
    );
  });
});