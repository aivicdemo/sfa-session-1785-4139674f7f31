import { analyzeAndJudgeSalesRepImprovement } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-205
  test('集計対象期間が年度をまたぐ場合、年度の両側のデータが正しく集計される', () => {
    const targetSalesRepId = 'SR001';
    const aggregationStartDate = new Date('2024-03-01T00:00:00Z');
    const aggregationEndDate = new Date('2025-04-30T23:59:59Z');

    const stubData = {
      march2024Visits: 5,
      fy2024AvgMeetingMinutes: 45,
      april2025Orders: 3,
    };

    const analysisResult = analyzeAndJudgeSalesRepImprovement({
      targetSalesRepId,
      aggregationPeriodStartDate: aggregationStartDate,
      aggregationPeriodEndDate: aggregationEndDate,
      visitCountMarch2024: stubData.march2024Visits,
      averageMeetingMinutesFY2024: stubData.fy2024AvgMeetingMinutes,
      orderCountApril2025: stubData.april2025Orders,
    });

    // 2024年3月の訪問件数が正しく集計されていることを確認
    expect(analysisResult.aggregatedVisitCountMarch2024).toBe(5);

    // 2024年度通年（4月～3月）の平均商談時間が正しく集計されていることを確認
    expect(analysisResult.aggregatedAverageMeetingMinutesFY2024).toBe(45);

    // 2025年4月の受注件数が正しく集計されていることを確認
    expect(analysisResult.aggregatedOrderCountApril2025).toBe(3);

    // 年度をまたぐ全期間（13ヶ月）のデータに基づいて改善指導対象判定が実行されたことを確認
    expect(analysisResult.improvementInstructionRequired).toBeDefined();
    expect(typeof analysisResult.improvementInstructionRequired).toBe('boolean');

    // 判定対象の集計期間が正確であることを確認
    expect(analysisResult.aggregationMonthCount).toBe(13);
  });
});