import { generateSalesPersonPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1050: [edge] 営業担当者ごとの行動パターン分析レポート生成機能 - 実務適用報告の提出日が月初で集計に含まれる
  test('当月1日（月初）を提出日とした実務適用報告は集計に含まれ、前月と翌月の報告は集計に含まれない', () => {
    // Arrange
    const sales_person_id = 'SP-A001';
    const sales_person_name = '営業担当者A';
    const target_month_start = new Date('2024-01-01T00:00:00Z');
    const target_month_end = new Date('2024-01-31T23:59:59Z');

    const practical_application_reports = [
      {
        report_id: 'PAR-001',
        sales_person_id: sales_person_id,
        submission_date: new Date('2024-01-01T09:00:00Z'),
        sales_amount: 50000,
      },
      {
        report_id: 'PAR-002',
        sales_person_id: sales_person_id,
        submission_date: new Date('2023-12-30T09:00:00Z'),
        sales_amount: 30000,
      },
      {
        report_id: 'PAR-003',
        sales_person_id: sales_person_id,
        submission_date: new Date('2024-02-01T09:00:00Z'),
        sales_amount: 20000,
      },
    ];

    const input = {
      sales_person_id: sales_person_id,
      sales_person_name: sales_person_name,
      period_start: target_month_start,
      period_end: target_month_end,
      practical_application_reports: practical_application_reports,
    };

    // Act
    const result = generateSalesPersonPatternAnalysisReport(input);

    // Assert
    expect(result).toBeDefined();
    expect(result.sales_person_id).toBe(sales_person_id);
    expect(result.sales_person_name).toBe(sales_person_name);
    expect(result.period_start).toEqual(target_month_start);
    expect(result.period_end).toEqual(target_month_end);
    expect(result.aggregated_sales_amount).toBe(50000);
    expect(result.included_report_ids).toEqual(['PAR-001']);
    expect(result.included_report_ids).not.toContain('PAR-002');
    expect(result.included_report_ids).not.toContain('PAR-003');
  });
});