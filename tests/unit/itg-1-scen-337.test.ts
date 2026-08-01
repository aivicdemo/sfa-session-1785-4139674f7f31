import { generateSalesPersonActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-337
  test('期間の開始日と終了日が同日の場合、該当日の営業活動のみが分析対象となる', () => {
    const salesPersonId = 'sales_001';
    const analysisStartDate = new Date('2024-01-15T00:00:00Z');
    const analysisEndDate = new Date('2024-01-15T23:59:59Z');

    const salesActivitiesData = [
      {
        activityId: 'activity_001',
        salesPersonId: 'sales_001',
        activityType: 'visit',
        activityDate: new Date('2024-01-15T09:00:00Z'),
        duration: 60,
      },
      {
        activityId: 'activity_002',
        salesPersonId: 'sales_001',
        activityType: 'phone',
        activityDate: new Date('2024-01-15T10:30:00Z'),
        duration: 15,
      },
      {
        activityId: 'activity_003',
        salesPersonId: 'sales_001',
        activityType: 'phone',
        activityDate: new Date('2024-01-15T14:00:00Z'),
        duration: 20,
      },
      {
        activityId: 'activity_004',
        salesPersonId: 'sales_001',
        activityType: 'email',
        activityDate: new Date('2024-01-16T08:00:00Z'),
        duration: 5,
      },
      {
        activityId: 'activity_005',
        salesPersonId: 'sales_001',
        activityType: 'proposal',
        activityDate: new Date('2024-01-16T11:00:00Z'),
        duration: 30,
      },
    ];

    const report = generateSalesPersonActivityPatternReport({
      salesPersonId,
      analysisStartDate,
      analysisEndDate,
      salesActivitiesData,
    });

    expect(report.salesPersonId).toBe('sales_001');
    expect(report.analysisStartDate).toEqual(new Date('2024-01-15T00:00:00Z'));
    expect(report.analysisEndDate).toEqual(new Date('2024-01-15T23:59:59Z'));

    expect(report.includedActivities).toHaveLength(3);
    expect(report.includedActivities[0].activityId).toBe('activity_001');
    expect(report.includedActivities[0].activityType).toBe('visit');
    expect(report.includedActivities[1].activityId).toBe('activity_002');
    expect(report.includedActivities[1].activityType).toBe('phone');
    expect(report.includedActivities[2].activityId).toBe('activity_003');
    expect(report.includedActivities[2].activityType).toBe('phone');

    expect(report.activityPatternStats.visitRate).toBe(33.3);
    expect(report.activityPatternStats.phoneRate).toBe(66.7);
    expect(report.activityPatternStats.emailRate).toBe(0);
    expect(report.activityPatternStats.proposalRate).toBe(0);

    expect(report.activityPatternStats.totalActivities).toBe(3);
    expect(report.activityPatternStats.visitCount).toBe(1);
    expect(report.activityPatternStats.phoneCount).toBe(2);
    expect(report.activityPatternStats.emailCount).toBe(0);
    expect(report.activityPatternStats.proposalCount).toBe(0);

    expect(report.activityPatternStats.totalDuration).toBe(95);
    expect(report.activityPatternStats.averageDurationPerActivity).toBe(31.67);
  });
});