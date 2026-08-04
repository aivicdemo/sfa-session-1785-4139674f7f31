import { aggregateDataQualityReport } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質レポート集計機能', () => {
  // SCEN-435
  test('検証対象期間が月初と月末にまたがる場合、全検証結果が集計される', () => {
    const startDate = new Date('2024-01-01T00:00:00Z');
    const endDate = new Date('2024-01-31T23:59:59Z');

    const validationResults = [
      {
        id: 'vr_001',
        executedAt: new Date('2024-01-01T08:30:00Z'),
        status: 'success',
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
      {
        id: 'vr_002',
        executedAt: new Date('2024-01-02T09:15:00Z'),
        status: 'success',
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
      {
        id: 'vr_003',
        executedAt: new Date('2024-01-03T10:45:00Z'),
        status: 'failure',
        checkItemCount: 15,
        abnormalDataCount: 2,
      },
      {
        id: 'vr_004',
        executedAt: new Date('2024-01-10T11:20:00Z'),
        status: 'success',
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
      {
        id: 'vr_005',
        executedAt: new Date('2024-01-15T12:00:00Z'),
        status: 'success',
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
      {
        id: 'vr_006',
        executedAt: new Date('2024-01-20T13:30:00Z'),
        status: 'failure',
        checkItemCount: 15,
        abnormalDataCount: 1,
      },
      {
        id: 'vr_007',
        executedAt: new Date('2024-01-22T14:15:00Z'),
        status: 'success',
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
      {
        id: 'vr_008',
        executedAt: new Date('2024-01-25T15:45:00Z'),
        status: 'success',
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
      {
        id: 'vr_009',
        executedAt: new Date('2024-01-31T16:30:00Z'),
        status: 'success',
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
      {
        id: 'vr_010',
        executedAt: new Date('2024-01-31T17:00:00Z'),
        status: 'failure',
        checkItemCount: 15,
        abnormalDataCount: 3,
      },
    ];

    const report = aggregateDataQualityReport(startDate, endDate, validationResults);

    expect(report.aggregatedResultCount).toBe(10);
    expect(report.successCount).toBe(7);
    expect(report.failureCount).toBe(3);
    expect(report.totalCheckItems).toBe(150);
    expect(report.totalAbnormalData).toBe(6);

    const initialDateResults = report.results.filter(
      (r) => r.executedAt.getDate() >= 1 && r.executedAt.getDate() <= 3
    );
    expect(initialDateResults).toHaveLength(3);

    const midMonthResults = report.results.filter(
      (r) => r.executedAt.getDate() >= 10 && r.executedAt.getDate() <= 25
    );
    expect(midMonthResults).toHaveLength(5);

    const endMonthResults = report.results.filter(
      (r) => r.executedAt.getDate() === 31
    );
    expect(endMonthResults).toHaveLength(2);

    report.results.forEach((result) => {
      expect(result.executedAt.getTime()).toBeGreaterThanOrEqual(
        startDate.getTime()
      );
      expect(result.executedAt.getTime()).toBeLessThanOrEqual(endDate.getTime());
      expect(['success', 'failure']).toContain(result.status);
      expect(result.checkItemCount).toBe(15);
      expect(typeof result.abnormalDataCount).toBe('number');
    });

    expect(report.reportGeneratedAt).toBeTruthy();
    expect(typeof report.reportGeneratedAt).toBe('object');
  });
});