import { DataQualityReportAggregator } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質レポート集計', () => {
  // SCEN-434
  test('検証対象期間が1日の場合、その日の検証結果が集計される', () => {
    const aggregationDate = new Date('2026-08-01T00:00:00Z');
    const validationExecutionDatetime = new Date('2026-08-01T09:00:00Z');
    
    const mockValidationResult = {
      validationId: 'val-001',
      executionDatetime: validationExecutionDatetime,
      validationType: 'データ品質チェック',
      totalRecords: 5,
      passedRecords: 4,
      failedRecords: 1,
      qualityScore: 80,
      validationRuleId: 'rule-001',
      targetSystem: 'sales-data',
      createdAt: validationExecutionDatetime,
    };

    const aggregator = new DataQualityReportAggregator();
    aggregator.setMockData([mockValidationResult]);

    const result = aggregator.aggregateByDateRange(
      new Date('2026-08-01T00:00:00Z'),
      new Date('2026-08-01T23:59:59Z')
    );

    expect(result.aggregationPeriod).toBe('2026-08-01');
    expect(result.totalValidationRecords).toBe(5);
    expect(result.passedCount).toBe(4);
    expect(result.failedCount).toBe(1);
    expect(result.qualityScore).toBe(80);
    expect(result.aggregationDate).toEqual(aggregationDate);
    expect(result.dataPoints).toHaveLength(1);
    expect(result.dataPoints[0]).toEqual(expect.objectContaining({
      validationId: 'val-001',
      validationType: 'データ品質チェック',
      totalRecords: 5,
      passedRecords: 4,
      failedRecords: 1,
      qualityScore: 80,
    }));
  });
});