import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateSalesActivityReportMetrics } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-585: [edge] 営業担当者の行動パターン分析レポート生成機能 - 分析対象期間の開始日と終了日が同日である場合
  test('should generate activity report when start and end dates are the same day', () => {
    const reportStartDate = new Date('2024-01-15T00:00:00Z');
    const reportEndDate = new Date('2024-01-15T23:59:59Z');

    const activityData = [
      {
        salesPersonId: 'SP001',
        activityType: 'visit',
        activityDate: new Date('2024-01-15T09:00:00Z'),
        customerId: 'C001',
        duration: 60,
      },
      {
        salesPersonId: 'SP001',
        activityType: 'negotiation',
        activityDate: new Date('2024-01-15T14:00:00Z'),
        customerId: 'C002',
        duration: 45,
      },
      {
        salesPersonId: 'SP001',
        activityType: 'proposal',
        activityDate: new Date('2024-01-15T16:30:00Z'),
        customerId: 'C003',
        duration: 30,
      },
      {
        salesPersonId: 'SP002',
        activityType: 'visit',
        activityDate: new Date('2024-01-15T10:15:00Z'),
        customerId: 'C004',
        duration: 50,
      },
      {
        salesPersonId: 'SP002',
        activityType: 'call',
        activityDate: new Date('2024-01-15T11:00:00Z'),
        customerId: 'C005',
        duration: 20,
      },
    ];

    const result = calculateSalesActivityReportMetrics({
      reportStartDate,
      reportEndDate,
      activityData,
    });

    expect(result.reportStatus).toBe('completed');
    expect(result.analysisStartDate).toEqual(reportStartDate);
    expect(result.analysisEndDate).toEqual(reportEndDate);
    expect(result.totalRecordsProcessed).toBe(5);
    expect(result.dataAggregationErrorCount).toBe(0);
    expect(result.reportByActivityType.visit).toBe(2);
    expect(result.reportByActivityType.negotiation).toBe(1);
    expect(result.reportByActivityType.proposal).toBe(1);
    expect(result.reportByActivityType.call).toBe(1);
    expect(result.totalActivityDuration).toBe(205);
    expect(result.uniqueCustomersEngaged).toBe(5);
    expect(result.salesPersonActivitySummary).toHaveLength(2);

    const sp001Summary = result.salesPersonActivitySummary.find(
      (summary) => summary.salesPersonId === 'SP001'
    );
    expect(sp001Summary).toBeDefined();
    expect(sp001Summary!.totalActivities).toBe(3);
    expect(sp001Summary!.totalDuration).toBe(135);
    expect(sp001Summary!.activityBreakdown.visit).toBe(1);
    expect(sp001Summary!.activityBreakdown.negotiation).toBe(1);
    expect(sp001Summary!.activityBreakdown.proposal).toBe(1);

    const sp002Summary = result.salesPersonActivitySummary.find(
      (summary) => summary.salesPersonId === 'SP002'
    );
    expect(sp002Summary).toBeDefined();
    expect(sp002Summary!.totalActivities).toBe(2);
    expect(sp002Summary!.totalDuration).toBe(70);
    expect(sp002Summary!.activityBreakdown.visit).toBe(1);
    expect(sp002Summary!.activityBreakdown.call).toBe(1);
  });
});