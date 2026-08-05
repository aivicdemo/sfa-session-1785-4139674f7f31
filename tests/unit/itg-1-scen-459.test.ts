import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-459
  test('営業活動の訪問・電話・メール等の種類ごとに、活動頻度分布が正常に分類集計される', () => {
    // Arrange: テストデータ準備
    const sales_person_id = 'SA001';
    const activity_records = [
      {
        activity_id: 'ACT001',
        sales_person_id: 'SA001',
        activity_type: 'visit',
        activity_date: new Date('2024-12-01T09:00:00Z'),
        duration_minutes: 30
      },
      {
        activity_id: 'ACT002',
        sales_person_id: 'SA001',
        activity_type: 'visit',
        activity_date: new Date('2024-12-03T10:00:00Z'),
        duration_minutes: 45
      },
      {
        activity_id: 'ACT003',
        sales_person_id: 'SA001',
        activity_type: 'visit',
        activity_date: new Date('2024-12-05T14:00:00Z'),
        duration_minutes: 60
      },
      {
        activity_id: 'ACT004',
        sales_person_id: 'SA001',
        activity_type: 'visit',
        activity_date: new Date('2024-12-10T11:00:00Z'),
        duration_minutes: 50
      },
      {
        activity_id: 'ACT005',
        sales_person_id: 'SA001',
        activity_type: 'visit',
        activity_date: new Date('2024-12-15T15:00:00Z'),
        duration_minutes: 40
      },
      {
        activity_id: 'ACT006',
        sales_person_id: 'SA001',
        activity_type: 'phone',
        activity_date: new Date('2024-12-02T13:00:00Z'),
        duration_minutes: 15
      },
      {
        activity_id: 'ACT007',
        sales_person_id: 'SA001',
        activity_type: 'phone',
        activity_date: new Date('2024-12-08T09:30:00Z'),
        duration_minutes: 20
      },
      {
        activity_id: 'ACT008',
        sales_person_id: 'SA001',
        activity_type: 'phone',
        activity_date: new Date('2024-12-20T16:00:00Z'),
        duration_minutes: 25
      },
      {
        activity_id: 'ACT009',
        sales_person_id: 'SA001',
        activity_type: 'email',
        activity_date: new Date('2024-12-04T08:00:00Z'),
        duration_minutes: 5
      },
      {
        activity_id: 'ACT010',
        sales_person_id: 'SA001',
        activity_type: 'email',
        activity_date: new Date('2024-12-18T17:00:00Z'),
        duration_minutes: 10
      }
    ];

    // Act: 行動パターン分析レポート生成関数を実行
    const report = generateBehaviorPatternAnalysisReport({
      sales_person_id: sales_person_id,
      activity_records: activity_records,
      analysis_period_days: 30
    });

    // Assert: 活動種類ごとの集計データを検証
    expect(report).toBeDefined();
    expect(report.sales_person_id).toBe('SA001');
    expect(report.total_activities).toBe(10);

    // 訪問の集計件数が5件であることを確認
    const visit_count = report.activity_distribution.find(
      (dist: { activity_type: string; count: number; percentage: number }) => dist.activity_type === 'visit'
    );
    expect(visit_count).toBeDefined();
    expect(visit_count.count).toBe(5);

    // 電話の集計件数が3件であることを確認
    const phone_count = report.activity_distribution.find(
      (dist: { activity_type: string; count: number; percentage: number }) => dist.activity_type === 'phone'
    );
    expect(phone_count).toBeDefined();
    expect(phone_count.count).toBe(3);

    // メールの集計件数が2件であることを確認
    const email_count = report.activity_distribution.find(
      (dist: { activity_type: string; count: number; percentage: number }) => dist.activity_type === 'email'
    );
    expect(email_count).toBeDefined();
    expect(email_count.count).toBe(2);

    // 活動頻度分布の比率が訪問50%、電話30%、メール20%に分類されていることを確認
    expect(visit_count.percentage).toBe(50);
    expect(phone_count.percentage).toBe(30);
    expect(email_count.percentage).toBe(20);
  });
});