import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-627
  test('チーム平均との乖離度がちょうど0%で計算される（担当者成績 = チーム平均の場合）', () => {
    const salesPersonA = {
      id: 'A',
      name: '営業担当者A',
      monthlySales: 1000000,
    };

    const salesPersonB = {
      id: 'B',
      name: '営業担当者B',
      monthlySales: 900000,
    };

    const salesPersonC = {
      id: 'C',
      name: '営業担当者C',
      monthlySales: 1000000,
    };

    const salesPersonD = {
      id: 'D',
      name: '営業担当者D',
      monthlySales: 1100000,
    };

    const teamMembers = [salesPersonA, salesPersonB, salesPersonC, salesPersonD];

    const teamAverageSales = (1000000 + 900000 + 1000000 + 1100000) / 4;
    expect(teamAverageSales).toBe(1000000);

    const report = generateBehaviorPatternAnalysisReport({
      targetSalesPersonId: 'A',
      teamMembers,
      reportMonth: '2024-01',
    });

    expect(report.salesPersonId).toBe('A');
    expect(report.monthlySales).toBe(1000000);
    expect(report.teamAverageSales).toBe(1000000);
    expect(report.deviationFromTeamAverage).toBe(0);
  });
});