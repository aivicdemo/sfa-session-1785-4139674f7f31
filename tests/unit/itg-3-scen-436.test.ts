import { aggregateQualityReportByPeriod } from '../../src/logic/itg-3';

describe('データ品質レポート集計機能', () => {
  // SCEN-436
  test('検証対象期間が年をまたぐ場合、全検証結果が集計される', () => {
    const periodStart = new Date('2023-11-01T00:00:00Z');
    const periodEnd = new Date('2024-01-31T23:59:59Z');

    const mockResults2023Nov = Array.from({ length: 150 }, (_, i) => ({
      id: `result_2023_nov_${i}`,
      verificationDate: new Date(`2023-11-${String((i % 30) + 1).padStart(2, '0')}T12:00:00Z`),
      qualityScore: 85 + Math.random() * 10,
      errorCount: Math.floor(Math.random() * 5),
      warningCount: Math.floor(Math.random() * 10),
    }));

    const mockResults2024Jan = Array.from({ length: 95 }, (_, i) => ({
      id: `result_2024_jan_${i}`,
      verificationDate: new Date(`2024-01-${String((i % 31) + 1).padStart(2, '0')}T12:00:00Z`),
      qualityScore: 82 + Math.random() * 12,
      errorCount: Math.floor(Math.random() * 6),
      warningCount: Math.floor(Math.random() * 12),
    }));

    const allResults = [...mockResults2023Nov, ...mockResults2024Jan];

    const aggregatedReport = aggregateQualityReportByPeriod(periodStart, periodEnd, allResults);

    // 集計結果に245件すべてが含まれていることを検証
    expect(aggregatedReport.totalRecordCount).toBe(245);

    // 2023年11月～12月のデータ件数を検証
    const resultsInNovDec = aggregatedReport.resultsByMonth.find(
      (m) => m.month === '2023-11' || m.month === '2023-12'
    );
    expect((aggregatedReport.resultsByMonth.filter((m) => m.month.startsWith('2023'))[0]?.count ?? 0) + 
            (aggregatedReport.resultsByMonth.filter((m) => m.month.startsWith('2023'))[1]?.count ?? 0)).toBe(150);

    // 2024年1月のデータ件数を検証
    const resultsInJan = aggregatedReport.resultsByMonth.find((m) => m.month === '2024-01');
    expect(resultsInJan?.count).toBe(95);

    // 集計結果内のすべての検証結果が指定期間内であることを検証
    aggregatedReport.verificationResults.forEach((result) => {
      const resultDate = new Date(result.verificationDate);
      expect(resultDate.getTime()).toBeGreaterThanOrEqual(periodStart.getTime());
      expect(resultDate.getTime()).toBeLessThanOrEqual(periodEnd.getTime());
    });

    // 統計情報の正確性を検証
    const qualityScores = aggregatedReport.verificationResults.map((r) => r.qualityScore);
    const avgScore = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length;
    expect(aggregatedReport.statistics.averageQualityScore).toBeCloseTo(avgScore, 2);

    const maxScore = Math.max(...qualityScores);
    expect(aggregatedReport.statistics.maxQualityScore).toBe(maxScore);

    const minScore = Math.min(...qualityScores);
    expect(aggregatedReport.statistics.minQualityScore).toBe(minScore);

    const totalErrors = aggregatedReport.verificationResults.reduce((sum, r) => sum + r.errorCount, 0);
    expect(aggregatedReport.statistics.totalErrorCount).toBe(totalErrors);

    const totalWarnings = aggregatedReport.verificationResults.reduce((sum, r) => sum + r.warningCount, 0);
    expect(aggregatedReport.statistics.totalWarningCount).toBe(totalWarnings);

    // 集計レポートの生成日が有効な日付形式であることを検証
    expect(typeof aggregatedReport.generatedAt).toBe('object');
    expect(aggregatedReport.generatedAt instanceof Date).toBe(true);

    // 期間内のすべての検証結果が漏れなく含まれていることを検証
    expect(aggregatedReport.verificationResults.length).toBe(245);
  });
});