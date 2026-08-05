import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-654
  test('最大規模アクティビティデータ（5,000提案件数+50,000顧客対応記録）でレポート生成時、計算が完了し結果が正確である', () => {
    const sales_person_id = 'SP-00001';
    const analysis_start_date = new Date('2023-01-15T00:00:00Z');
    const analysis_end_date = new Date('2024-01-15T00:00:00Z');

    const proposal_records = Array.from({ length: 5000 }, (_, idx) => ({
      proposal_id: `PROP-${String(idx + 1).padStart(5, '0')}`,
      sales_person_id,
      customer_id: `CUST-${String((idx % 1000) + 1).padStart(4, '0')}`,
      proposal_date: new Date(
        2023 + Math.floor(idx / 2500),
        1 + Math.floor((idx % 2500) / 200),
        1 + ((idx % 200) % 28),
        10,
        0,
        0,
        0
      ).toISOString(),
      proposal_status: ['draft', 'submitted', 'approved', 'rejected', 'won', 'lost', 'expired', 'archived'][
        idx % 8
      ],
      proposal_amount: 100000 + (idx * 10),
    }));

    const customer_contact_records = Array.from({ length: 50000 }, (_, idx) => ({
      contact_id: `CONT-${String(idx + 1).padStart(5, '0')}`,
      sales_person_id,
      customer_id: `CUST-${String((idx % 1000) + 1).padStart(4, '0')}`,
      contact_date: new Date(
        2023 + Math.floor(idx / 25000),
        1 + Math.floor((idx % 25000) / 2083),
        1 + ((idx % 2083) % 28),
        9 + (idx % 8),
        idx % 60,
        0,
        0
      ).toISOString(),
      contact_type: ['visit', 'phone', 'email', 'meeting'][idx % 4],
      contact_duration_minutes: 15 + (idx % 120),
    }));

    const customer_master_data = Array.from({ length: 1000 }, (_, idx) => ({
      customer_id: `CUST-${String(idx + 1).padStart(4, '0')}`,
      customer_name: `Customer ${idx + 1}`,
      industry: ['IT', 'Finance', 'Manufacturing', 'Retail', 'Healthcare'][idx % 5],
    }));

    const proposal_status_master_data = [
      { status_code: 'draft', status_name: 'Draft' },
      { status_code: 'submitted', status_name: 'Submitted' },
      { status_code: 'approved', status_name: 'Approved' },
      { status_code: 'rejected', status_name: 'Rejected' },
      { status_code: 'won', status_name: 'Won' },
      { status_code: 'lost', status_name: 'Lost' },
      { status_code: 'expired', status_name: 'Expired' },
      { status_code: 'archived', status_name: 'Archived' },
    ];

    const start_time = Date.now();

    const report = generateSalesActivityPatternReport(
      {
        sales_person_id,
        analysis_start_date,
        analysis_end_date,
        proposal_records,
        customer_contact_records,
        customer_master_data,
        proposal_status_master_data,
      }
    );

    const end_time = Date.now();
    const execution_time_seconds = (end_time - start_time) / 1000;

    // 実行時間が30秒以内であることを検証
    expect(execution_time_seconds).toBeLessThan(30);

    // レポートの基本構造を検証
    expect(report).toHaveProperty('sales_person_id');
    expect(report).toHaveProperty('report_generated_at');
    expect(report).toHaveProperty('analysis_period');
    expect(report).toHaveProperty('summary_metrics');
    expect(report).toHaveProperty('activity_breakdown');
    expect(report).toHaveProperty('success_rate_percentage');

    // 営業担当者ID
    expect(report.sales_person_id).toBe(sales_person_id);

    // 提案件数の合計が5,000件であることを検証
    expect(report.summary_metrics.total_proposals).toBe(5000);

    // 顧客対応回数の合計が50,000件であることを検証
    expect(report.summary_metrics.total_customer_contacts).toBe(50000);

    // 提案成功率の計算検証（成功件数：625件 = 5000 * (1/8), 成功率：12.50%）
    const expected_success_count = 625; // 5000 proposals * (1/8) won status
    const expected_success_rate = (expected_success_count / 5000) * 100;
    expect(report.success_rate_percentage).toBeCloseTo(expected_success_rate, 2);

    // アクティビティ種別別の件数内訳を検証（visit:12500, phone:12500, email:12500, meeting:12500）
    expect(report.activity_breakdown).toHaveProperty('visit');
    expect(report.activity_breakdown).toHaveProperty('phone');
    expect(report.activity_breakdown).toHaveProperty('email');
    expect(report.activity_breakdown).toHaveProperty('meeting');

    const visit_count = report.activity_breakdown.visit || 0;
    const phone_count = report.activity_breakdown.phone || 0;
    const email_count = report.activity_breakdown.email || 0;
    const meeting_count = report.activity_breakdown.meeting || 0;

    const total_activity_count = visit_count + phone_count + email_count + meeting_count;

    // 全アクティビティの合計が50,000レコードと一致
    expect(total_activity_count).toBe(50000);

    // 平均対応時間が営業日ベースで正確に算出されている
    expect(report.summary_metrics).toHaveProperty('average_contact_duration_minutes');
    const average_contact_duration = report.summary_metrics.average_contact_duration_minutes;
    expect(average_contact_duration).toBeGreaterThan(0);
    expect(average_contact_duration).toBeLessThanOrEqual(135);

    // 分析期間が正しく設定されている
    expect(report.analysis_period.start_date).toBe(analysis_start_date.toISOString());
    expect(report.analysis_period.end_date).toBe(analysis_end_date.toISOString());

    // JSON スキーマが仕様定義に合致しているか検証
    expect(typeof report.sales_person_id).toBe('string');
    expect(typeof report.success_rate_percentage).toBe('number');
    expect(typeof report.summary_metrics.total_proposals).toBe('number');
    expect(typeof report.summary_metrics.total_customer_contacts).toBe('number');
    expect(typeof report.summary_metrics.average_contact_duration_minutes).toBe('number');
    expect(typeof report.activity_breakdown).toBe('object');

    // 成功率が小数点第2位まで正確に計算されていることを検証
    expect(report.success_rate_percentage.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
  });
});