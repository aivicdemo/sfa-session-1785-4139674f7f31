import { generateActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-478
  test('営業活動ログの時系列が逆順である場合も正しくレポートが生成される', () => {
    const salesPersonName = '田中太郎';
    const reversedActivityLogs = [
      {
        id: 'log_001',
        activityDate: new Date('2024-01-15T10:00:00Z'),
        activityType: '訪問',
        customerName: '顧客D',
        notes: ''
      },
      {
        id: 'log_002',
        activityDate: new Date('2024-01-10T14:30:00Z'),
        activityType: '電話',
        customerName: '顧客C',
        notes: ''
      },
      {
        id: 'log_003',
        activityDate: new Date('2024-01-05T09:15:00Z'),
        activityType: '資料送付',
        customerName: '顧客B',
        notes: ''
      },
      {
        id: 'log_004',
        activityDate: new Date('2024-01-01T16:00:00Z'),
        activityType: '初回接触',
        customerName: '顧客A',
        notes: ''
      }
    ];

    const report = generateActivityPatternReport(salesPersonName, reversedActivityLogs);

    expect(report.salesPersonName).toBe('田中太郎');
    expect(report.chronologicalActivities).toEqual([
      {
        timestamp: new Date('2024-01-01T16:00:00Z'),
        activity: '初回接触',
        customer: '顧客A'
      },
      {
        timestamp: new Date('2024-01-05T09:15:00Z'),
        activity: '資料送付',
        customer: '顧客B'
      },
      {
        timestamp: new Date('2024-01-10T14:30:00Z'),
        activity: '電話',
        customer: '顧客C'
      },
      {
        timestamp: new Date('2024-01-15T10:00:00Z'),
        activity: '訪問',
        customer: '顧客D'
      }
    ]);
    expect(report.contactPatternAnalysis.progressionPattern).toBe('段階的進展');
  });
});