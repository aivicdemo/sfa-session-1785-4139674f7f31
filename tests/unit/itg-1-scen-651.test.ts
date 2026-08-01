import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-651
  test('[normal] 営業活動の日付が過去3ヶ月範囲外の場合、統計値から除外される', () => {
    const salesPersonId = 'sales_001';
    const referenceDate = new Date('2024-01-15T00:00:00Z');
    const analysisPeriodDays = 90;

    const salesActivities = [
      {
        activityId: 'activity_001',
        salesPersonId: salesPersonId,
        activityType: 'visit',
        executedDate: new Date('2023-11-16T10:00:00Z'),
        durationMinutes: 45,
      },
      {
        activityId: 'activity_002',
        salesPersonId: salesPersonId,
        activityType: 'phone',
        executedDate: new Date('2023-10-17T14:30:00Z'),
        durationMinutes: 20,
      },
      {
        activityId: 'activity_003',
        salesPersonId: salesPersonId,
        activityType: 'negotiation',
        executedDate: new Date('2023-10-07T09:00:00Z'),
        durationMinutes: 60,
      },
      {
        activityId: 'activity_004',
        salesPersonId: salesPersonId,
        activityType: 'email',
        executedDate: new Date('2023-12-16T16:45:00Z'),
        durationMinutes: 10,
      },
    ];

    const report = generateSalesActivityPatternAnalysisReport({
      salesPersonId: salesPersonId,
      referenceDate: referenceDate,
      analysisPeriodDays: analysisPeriodDays,
      salesActivities: salesActivities,
    });

    expect(report.includedActivityCount).toBe(3);
    expect(report.totalActivities).toBe(3);

    expect(report.activityTypeDistribution).toEqual({
      visit: 1,
      phone: 1,
      negotiation: 0,
      email: 1,
    });

    expect(report.averageActivityFrequencyPerDay).toBeCloseTo(0.0333, 3);

    const activity100daysAgo = salesActivities.find(
      (a) => a.activityId === 'activity_003'
    );
    expect(
      report.excludedActivities.some(
        (excluded) => excluded.activityId === activity100daysAgo?.activityId
      )
    ).toBe(true);

    expect(report.analysisPeriodStartDate).toEqual(
      new Date('2023-10-17T00:00:00Z')
    );
    expect(report.analysisPeriodEndDate).toEqual(
      new Date('2024-01-15T00:00:00Z')
    );
  });
});