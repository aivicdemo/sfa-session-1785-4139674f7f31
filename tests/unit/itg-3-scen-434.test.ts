import { DataQualityReportAggregator } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  // SCEN-434
  test('データ品質レポート集計機能 - 検証対象期間が1日の場合、その日の検証結果が集計される', () => {
    const aggregationTargetDate = '2026-08-01';
    const validationExecutedAt = new Date('2026-08-01T09:00:00Z');
    const totalRecords = 5;
    const passedCount = 4;
    const failedCount = 1;
    const expectedQualityScore = 80;

    const mockValidationResults = [
      {
        validationId: 'val-001',
        executedAt: validationExecutedAt,
        validationType: 'データ品質チェック',
        totalRecords,
        passedCount,
        failedCount,
        qualityScore: expectedQualityScore,
      },
    ];

    const mockDatabase = {
      getValidationResultsByDateRange: jest
        .fn()
        .mockReturnValue(mockValidationResults),
    };

    const aggregator = new DataQualityReportAggregator(mockDatabase);
    const result = aggregator.aggregateByDateRange(
      aggregationTargetDate,
      aggregationTargetDate
    );

    expect(result.aggregationPeriod).toBe('2026-08-01');
    expect(result.totalValidationRecords).toBe(5);
    expect(result.passedCount).toBe(4);
    expect(result.failedCount).toBe(1);
    expect(result.qualityScore).toBe(80);
    expect(result.aggregationDate).toBe('2026-08-01');
    expect(result.dataPoints).toHaveLength(1);
    expect(result.dataPoints[0]).toEqual({
      validationId: 'val-001',
      executedAt: validationExecutedAt,
      validationType: 'データ品質チェック',
      totalRecords: 5,
      passedCount: 4,
      failedCount: 1,
      qualityScore: 80,
    });
  });
});