import { generateSalesPersonActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-656
  test('営業活動ログが逆順で提供される場合、統計値が順序に依存せず正確に計算される', () => {
    const sales_person_id = 'sales001';

    const activity_logs_unsorted = [
      {
        sales_person_id: 'sales001',
        activity_date: new Date('2024-01-01T09:30:00Z'),
        activity_type: 'visit',
        customer_id: 'cust001',
        duration_minutes: 30
      },
      {
        sales_person_id: 'sales001',
        activity_date: new Date('2024-01-03T09:45:00Z'),
        activity_type: 'visit',
        customer_id: 'cust002',
        duration_minutes: 45
      },
      {
        sales_person_id: 'sales001',
        activity_date: new Date('2024-01-02T10:15:00Z'),
        activity_type: 'visit',
        customer_id: 'cust003',
        duration_minutes: 20
      },
      {
        sales_person_id: 'sales001',
        activity_date: new Date('2024-01-05T09:00:00Z'),
        activity_type: 'visit',
        customer_id: 'cust004',
        duration_minutes: 60
      },
      {
        sales_person_id: 'sales001',
        activity_date: new Date('2024-01-04T09:20:00Z'),
        activity_type: 'visit',
        customer_id: 'cust005',
        duration_minutes: 25
      }
    ];

    const activity_logs_descending = [...activity_logs_unsorted].sort(
      (a, b) => b.activity_date.getTime() - a.activity_date.getTime()
    );

    const activity_logs_ascending = [...activity_logs_unsorted].sort(
      (a, b) => a.activity_date.getTime() - b.activity_date.getTime()
    );

    const report_from_descending = generateSalesPersonActivityPatternReport(
      sales_person_id,
      activity_logs_descending
    );

    const report_from_ascending = generateSalesPersonActivityPatternReport(
      sales_person_id,
      activity_logs_ascending
    );

    expect(report_from_descending.visit_count).toBe(5);
    expect(report_from_descending.average_visit_interval_days).toBe(1.5);
    expect(report_from_descending.most_frequent_visit_time_slot).toBe('09:00-10:00');

    expect(report_from_ascending.visit_count).toBe(5);
    expect(report_from_ascending.average_visit_interval_days).toBe(1.5);
    expect(report_from_ascending.most_frequent_visit_time_slot).toBe('09:00-10:00');

    expect(report_from_descending.visit_count).toBe(report_from_ascending.visit_count);
    expect(report_from_descending.average_visit_interval_days).toBe(
      report_from_ascending.average_visit_interval_days
    );
    expect(report_from_descending.most_frequent_visit_time_slot).toBe(
      report_from_ascending.most_frequent_visit_time_slot
    );
  });
});