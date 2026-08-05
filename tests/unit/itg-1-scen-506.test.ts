import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateSalesActivityAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-506
  test('[edge] 営業担当者ごとの行動パターン分析レポート生成機能 - 年度をまたぐ複数月の営業活動データが正しく集計される', () => {
    const sales_rep_id = 'SR-001';
    const start_date = '2023-12-01';
    const end_date = '2024-02-28';

    const mock_activities = [
      // 2023年12月のデータ（15件）
      ...Array.from({ length: 15 }, (_, i) => ({
        activity_id: `ACT-2312-${String(i + 1).padStart(3, '0')}`,
        sales_rep_id,
        activity_date: `2023-12-${String((i % 28) + 1).padStart(2, '0')}`,
        activity_type: 'visit',
        customer_id: `CUST-${String(i + 1).padStart(4, '0')}`,
      })),
      // 2024年1月のデータ（22件）
      ...Array.from({ length: 22 }, (_, i) => ({
        activity_id: `ACT-2401-${String(i + 1).padStart(3, '0')}`,
        sales_rep_id,
        activity_date: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
        activity_type: 'call',
        customer_id: `CUST-${String(i + 101).padStart(4, '0')}`,
      })),
      // 2024年2月のデータ（18件）
      ...Array.from({ length: 18 }, (_, i) => ({
        activity_id: `ACT-2402-${String(i + 1).padStart(3, '0')}`,
        sales_rep_id,
        activity_date: `2024-02-${String((i % 28) + 1).padStart(2, '0')}`,
        activity_type: 'email',
        customer_id: `CUST-${String(i + 201).padStart(4, '0')}`,
      })),
    ];

    const report = generateSalesActivityAnalysisReport({
      sales_rep_id,
      start_date,
      end_date,
      activities: mock_activities,
    });

    expect(report).toBeDefined();
    expect(report.metadata.aggregation_period_start).toBe('2023-12-01');
    expect(report.metadata.aggregation_period_end).toBe('2024-02-28');
    expect(report.metadata.period_label).toBe('前年度12月1日～当年度2月28日');

    expect(report.monthly_summary).toBeDefined();
    expect(report.monthly_summary).toHaveLength(3);

    const dec_summary = report.monthly_summary.find((m) => m.month === '2023-12');
    expect(dec_summary).toBeDefined();
    expect(dec_summary?.activity_count).toBe(15);

    const jan_summary = report.monthly_summary.find((m) => m.month === '2024-01');
    expect(jan_summary).toBeDefined();
    expect(jan_summary?.activity_count).toBe(22);

    const feb_summary = report.monthly_summary.find((m) => m.month === '2024-02');
    expect(feb_summary).toBeDefined();
    expect(feb_summary?.activity_count).toBe(18);

    expect(report.aggregation_results).toBeDefined();
    expect(report.aggregation_results.total_activity_count).toBe(55);
    expect(report.aggregation_results.previous_fiscal_year_december_count).toBe(15);
    expect(report.aggregation_results.current_fiscal_year_january_count).toBe(22);
    expect(report.aggregation_results.current_fiscal_year_february_count).toBe(18);
  });
});