import { generateSalesPersonAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-626
  test('チーム平均との乖離度が負のパーセンテージで計算される（担当者成績 < チーム平均の場合）', () => {
    const salesPersonId = 'SP001';
    const salesPersonName = '営業担当者A';
    const salesPersonRevenue = 8000000;
    const teamAverageRevenue = 10000000;
    const analysisStartDate = '2024-01-01';
    const analysisEndDate = '2024-01-31';

    const result = generateSalesPersonAnalysisReport({
      salesPersonId,
      salesPersonName,
      salesPersonRevenue,
      teamAverageRevenue,
      analysisStartDate,
      analysisEndDate,
    });

    expect(result.deviationPercentageFromTeamAverage).toBe(-20.0);
  });
});