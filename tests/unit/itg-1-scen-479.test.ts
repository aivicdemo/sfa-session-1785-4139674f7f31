import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-479
  test('[edge] 営業活動ログに重複データが含まれる場合、重複を排除した上でレポートが生成される', () => {
    const salesPersonId = 'SA001';
    const customerId = 'CUST-123';
    const activityDateTime = '2024-01-15T10:30:00Z';
    const activityType = '電話';

    const activityLogs = [
      {
        id: 'LOG001',
        salesPersonId,
        customerId,
        activityDateTime,
        activityType,
        notes: '初回接触',
      },
      {
        id: 'LOG002',
        salesPersonId,
        customerId,
        activityDateTime,
        activityType,
        notes: '初回接触',
      },
      {
        id: 'LOG003',
        salesPersonId,
        customerId,
        activityDateTime,
        activityType,
        notes: '初回接触',
      },
      {
        id: 'LOG004',
        salesPersonId,
        customerId: 'CUST-456',
        activityDateTime: '2024-01-16T14:00:00Z',
        activityType: 'メール',
        notes: 'フォローアップ',
      },
      {
        id: 'LOG005',
        salesPersonId,
        customerId: 'CUST-789',
        activityDateTime: '2024-01-17T09:15:00Z',
        activityType: '訪問',
        notes: '提案',
      },
      {
        id: 'LOG006',
        salesPersonId,
        customerId: 'CUST-456',
        activityDateTime: '2024-01-18T11:45:00Z',
        activityType: '電話',
        notes: '交渉',
      },
      {
        id: 'LOG007',
        salesPersonId,
        customerId: 'CUST-789',
        activityDateTime: '2024-01-19T13:30:00Z',
        activityType: 'メール',
        notes: '見積送付',
      },
      {
        id: 'LOG008',
        salesPersonId,
        customerId: 'CUST-101',
        activityDateTime: '2024-01-20T10:00:00Z',
        activityType: '訪問',
        notes: 'クロージング',
      },
      {
        id: 'LOG009',
        salesPersonId,
        customerId: 'CUST-202',
        activityDateTime: '2024-01-21T15:20:00Z',
        activityType: '電話',
        notes: '成約報告',
      },
      {
        id: 'LOG010',
        salesPersonId,
        customerId: 'CUST-303',
        activityDateTime: '2024-01-22T08:45:00Z',
        activityType: 'メール',
        notes: 'アフターフォロー',
      },
    ];

    const report = generateSalesActivityPatternAnalysisReport({
      salesPersonId,
      activityLogs,
    });

    expect(report.totalActivityCount).toBe(7);
    expect(report.customerContactCounts).toEqual(
      expect.objectContaining({
        'CUST-123': 1,
      })
    );
    expect(report.detailedActivityLogs.length).toBe(7);
  });
});