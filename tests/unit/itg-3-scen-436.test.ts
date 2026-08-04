import { aggregateDataQualityReport } from '../../src/logic/itg-3';

describe('データ品質レポート集計機能', () => {
  test('SCEN-436: 検証対象期間が年をまたぐ場合、全検証結果が集計される', () => {
    // 期間定義: 2023年11月1日～2024年1月31日
    const periodStartDate = new Date('2023-11-01T00:00:00Z');
    const periodEndDate = new Date('2024-01-31T23:59:59Z');

    // 2023年11月～12月の検証結果データ（150件）
    const nov2023Results = Array.from({ length: 150 }, (_, i) => ({
      id: `result_nov_${i}`,
      verificationDate: new Date(
        new Date('2023-11-01T00:00:00Z').getTime() +
          Math.floor(Math.random() * 61 * 24 * 60 * 60 * 1000)
      ),
      dataQualityScore: Math.floor(Math.random() * 100),
      recordsChecked: Math.floor(Math.random() * 1000) + 100,
      recordsWithErrors: Math.floor(Math.random() * 100),
    }));

    // 2024年1月の検証結果データ（95件）
    const jan2024Results = Array.from({ length: 95 }, (_, i) => ({
      id: `result_jan_${i}`,
      verificationDate: new Date(
        new Date('2024-01-01T00:00:00Z').getTime() +
          Math.floor(Math.random() * 31 * 24 * 60 * 60 * 1000)
      ),
      dataQualityScore: Math.floor(Math.random() * 100),
      recordsChecked: Math.floor(Math.random() * 1000) + 100,
      recordsWithErrors: Math.floor(Math.random() * 100),
    }));

    const allVerificationResults = [...nov2023Results, ...jan2024Results];

    // 集計機能を実行
    const aggregationResult = aggregateDataQualityReport({
      periodStartDate,
      periodEndDate,
      verificationResults: allVerificationResults,
    });

    // 集計結果の検証
    expect(aggregationResult.totalRecordsCount).toBe(245);
    expect(aggregationResult.nov2023RecordsCount).toBe(150);
    expect(aggregationResult.jan2024RecordsCount).toBe(95);

    // 統計情報の検証
    expect(typeof aggregationResult.averageDataQualityScore).toBe('number');
    expect(aggregationResult.averageDataQualityScore).toBeGreaterThanOrEqual(0);
    expect(aggregationResult.averageDataQualityScore).toBeLessThanOrEqual(100);

    expect(typeof aggregationResult.maxDataQualityScore).toBe('number');
    expect(typeof aggregationResult.minDataQualityScore).toBe('number');
    expect(aggregationResult.maxDataQualityScore).toBeGreaterThanOrEqual(
      aggregationResult.minDataQualityScore
    );

    expect(typeof aggregationResult.totalRecordsChecked).toBe('number');
    expect(aggregationResult.totalRecordsChecked).toBeGreaterThan(0);

    expect(typeof aggregationResult.totalRecordsWithErrors).toBe('number');
    expect(aggregationResult.totalRecordsWithErrors).toBeGreaterThanOrEqual(0);

    // 期間内の全検証結果が漏れなく含まれていることを検証
    const includedResults = aggregationResult.includedVerificationResults;
    expect(includedResults.length).toBe(245);

    includedResults.forEach((result) => {
      const resultDate = new Date(result.verificationDate);
      expect(resultDate.getTime()).toBeGreaterThanOrEqual(
        periodStartDate.getTime()
      );
      expect(resultDate.getTime()).toBeLessThanOrEqual(periodEndDate.getTime());
    });

    // 集計レポートのメタデータ検証
    expect(aggregationResult.reportGeneratedDate).toBeInstanceOf(Date);
    expect(aggregationResult.aggregationPeriodStart).toEqual(periodStartDate);
    expect(aggregationResult.aggregationPeriodEnd).toEqual(periodEndDate);
    expect(aggregationResult.isYearSpanning).toBe(true);
  });
});