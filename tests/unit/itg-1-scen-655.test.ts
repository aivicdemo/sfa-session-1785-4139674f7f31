import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-655
  test('営業活動ログが昇順で提供される場合、統計値が正確に計算される', () => {
    const sales_person_id = 'A';
    const activity_logs = [
      {
        sales_person_id: 'A',
        activity_datetime: new Date('2024-01-01T09:00:00Z'),
        activity_duration_minutes: 45,
      },
      {
        sales_person_id: 'A',
        activity_datetime: new Date('2024-01-01T10:30:00Z'),
        activity_duration_minutes: 30,
      },
      {
        sales_person_id: 'A',
        activity_datetime: new Date('2024-01-01T14:00:00Z'),
        activity_duration_minutes: 60,
      },
      {
        sales_person_id: 'A',
        activity_datetime: new Date('2024-01-02T08:00:00Z'),
        activity_duration_minutes: 50,
      },
      {
        sales_person_id: 'A',
        activity_datetime: new Date('2024-01-02T16:00:00Z'),
        activity_duration_minutes: 40,
      },
    ];

    const report = generateSalesActivityPatternAnalysisReport(
      sales_person_id,
      activity_logs
    );

    expect(report.average_activity_duration_minutes).toBe(45);
    expect(report.max_activity_duration_minutes).toBe(60);
    expect(report.min_activity_duration_minutes).toBe(30);
    expect(report.total_activity_duration_minutes).toBe(225);
  });
});