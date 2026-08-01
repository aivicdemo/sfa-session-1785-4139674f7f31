import { analyzeActivityPattern } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-800
  test('営業活動ログが複数件のとき、全件の活動から行動パターンを統計的に抽出する', async () => {
    const sales_id = 'sales001';
    const start_date = new Date('2024-01-10T00:00:00Z');
    const end_date = new Date('2024-01-12T23:59:59Z');

    const activity_logs = [
      {
        log_id: 'log001',
        sales_id: sales_id,
        activity_date_time: new Date('2024-01-10T09:00:00Z'),
        activity_type: '電話営業',
        target_customer_segment: '大企業',
      },
      {
        log_id: 'log002',
        sales_id: sales_id,
        activity_date_time: new Date('2024-01-10T14:30:00Z'),
        activity_type: 'メール営業',
        target_customer_segment: '中堅企業',
      },
      {
        log_id: 'log003',
        sales_id: sales_id,
        activity_date_time: new Date('2024-01-11T10:15:00Z'),
        activity_type: '電話営業',
        target_customer_segment: '大企業',
      },
      {
        log_id: 'log004',
        sales_id: sales_id,
        activity_date_time: new Date('2024-01-11T16:45:00Z'),
        activity_type: '訪問営業',
        target_customer_segment: '中堅企業',
      },
      {
        log_id: 'log005',
        sales_id: sales_id,
        activity_date_time: new Date('2024-01-12T11:00:00Z'),
        activity_type: '電話営業',
        target_customer_segment: '大企業',
      },
    ];

    const result = await analyzeActivityPattern(
      sales_id,
      start_date,
      end_date,
      activity_logs
    );

    expect(result).toEqual({
      sales_id: sales_id,
      analysis_period_start: start_date,
      analysis_period_end: end_date,
      total_activity_count: 5,
      most_frequent_activity_type: {
        activity_type: '電話営業',
        occurrence_count: 3,
        percentage: 60,
      },
      activity_type_distribution: [
        {
          activity_type: '電話営業',
          occurrence_count: 3,
          percentage: 60,
        },
        {
          activity_type: '訪問営業',
          occurrence_count: 1,
          percentage: 20,
        },
        {
          activity_type: 'メール営業',
          occurrence_count: 1,
          percentage: 20,
        },
      ],
      most_frequent_customer_segment: {
        customer_segment: '大企業',
        occurrence_count: 3,
        percentage: 60,
      },
      customer_segment_distribution: [
        {
          customer_segment: '大企業',
          occurrence_count: 3,
          percentage: 60,
        },
        {
          customer_segment: '中堅企業',
          occurrence_count: 2,
          percentage: 40,
        },
      ],
      average_activity_interval_hours: 24,
      peak_activity_time_slots: ['10:00-11:59', '14:00-16:59'],
    });
  });
});