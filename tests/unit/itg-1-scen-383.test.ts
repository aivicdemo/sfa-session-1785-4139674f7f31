import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-383
  test('行動ログデータに重複するレコードが含まれるとき、重複が排除されて計算される', () => {
    const salesPersonId = 'A001';
    const customerId_1 = 'C001';
    const customerId_2 = 'C002';
    const timestamp_1 = '2024-01-15T10:00:00Z';
    const timestamp_2 = '2024-01-15T14:30:00Z';
    const timestamp_3 = '2024-01-16T09:15:00Z';

    const activityLogRecords = [
      {
        salesPersonId: salesPersonId,
        activityType: 'visit',
        customerId: customerId_1,
        timestamp: timestamp_1,
        duration: 60,
      },
      {
        salesPersonId: salesPersonId,
        activityType: 'visit',
        customerId: customerId_1,
        timestamp: timestamp_1,
        duration: 60,
      },
      {
        salesPersonId: salesPersonId,
        activityType: 'visit',
        customerId: customerId_1,
        timestamp: timestamp_1,
        duration: 60,
      },
      {
        salesPersonId: salesPersonId,
        activityType: 'visit',
        customerId: customerId_1,
        timestamp: timestamp_1,
        duration: 60,
      },
      {
        salesPersonId: salesPersonId,
        activityType: 'visit',
        customerId: customerId_1,
        timestamp: timestamp_1,
        duration: 60,
      },
      {
        salesPersonId: salesPersonId,
        activityType: 'email',
        customerId: customerId_1,
        timestamp: timestamp_2,
        duration: 0,
      },
      {
        salesPersonId: salesPersonId,
        activityType: 'email',
        customerId: customerId_2,
        timestamp: timestamp_2,
        duration: 0,
      },
      {
        salesPersonId: salesPersonId,
        activityType: 'call',
        customerId: customerId_1,
        timestamp: timestamp_3,
        duration: 15,
      },
      {
        salesPersonId: salesPersonId,
        activityType: 'call',
        customerId: customerId_2,
        timestamp: timestamp_3,
        duration: 20,
      },
      {
        salesPersonId: salesPersonId,
        activityType: 'call',
        customerId: customerId_1,
        timestamp: timestamp_3,
        duration: 15,
      },
    ];

    const report = generateSalesActivityPatternAnalysisReport({
      salesPersonId: salesPersonId,
      activityLogRecords: activityLogRecords,
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
    });

    expect(report.processedRecordCount).toBe(5);
    expect(report.visitCount).toBe(1);
    expect(report.emailSendCount).toBe(2);
    expect(report.callResponseCount).toBe(2);
    expect(report.uniqueCustomerCount).toBe(2);
    expect(report.totalActivityDuration).toBe(110);
  });
});