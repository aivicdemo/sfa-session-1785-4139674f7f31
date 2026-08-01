import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-654
  test('営業活動ログが降順で提供される場合、統計値が正確に計算される', () => {
    const salesRepName = '田中太郎';
    const activityLogs = [
      {
        id: 'log1',
        salesperson_name: salesRepName,
        activity_type: '顧客訪問',
        activity_datetime: new Date('2024-01-15T14:30:00Z'),
        duration_minutes: 30,
      },
      {
        id: 'log2',
        salesperson_name: salesRepName,
        activity_type: '電話営業',
        activity_datetime: new Date('2024-01-15T10:00:00Z'),
        duration_minutes: 20,
      },
      {
        id: 'log3',
        salesperson_name: salesRepName,
        activity_type: '提案資料作成',
        activity_datetime: new Date('2024-01-14T16:00:00Z'),
        duration_minutes: 45,
      },
    ];

    const report = generateSalesActivityPatternAnalysisReport(activityLogs);

    expect(report.total_activity_count).toBe(3);
    expect(report.total_activity_duration_minutes).toBe(95);
    expect(report.average_activity_duration_minutes).toBeCloseTo(31.67, 1);
    expect(report.customer_visit_count).toBe(1);
    expect(report.phone_sales_count).toBe(1);
    expect(report.other_activity_count).toBe(1);
    expect(report.last_activity_datetime).toEqual(new Date('2024-01-14T16:00:00Z'));
  });
});