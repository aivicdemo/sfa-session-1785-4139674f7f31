import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-505
  test('月次分析対象期間の開始日と終了日が同日の場合に当日データのみ集計される', () => {
    // Arrange
    const sales_person_id = 'SP001';
    const analysis_start_date = new Date('2024-01-15T00:00:00Z');
    const analysis_end_date = new Date('2024-01-15T23:59:59Z');

    const activity_data = [
      {
        activity_id: 'ACT001',
        sales_person_id: 'SP001',
        activity_type: '訪問',
        activity_date: new Date('2024-01-15T09:30:00Z'),
        customer_id: 'CUST001',
      },
      {
        activity_id: 'ACT002',
        sales_person_id: 'SP001',
        activity_type: '提案',
        activity_date: new Date('2024-01-15T14:00:00Z'),
        customer_id: 'CUST002',
      },
      {
        activity_id: 'ACT003',
        sales_person_id: 'SP001',
        activity_type: '受注',
        activity_date: new Date('2024-01-15T16:45:00Z'),
        customer_id: 'CUST003',
      },
      {
        activity_id: 'ACT004',
        sales_person_id: 'SP001',
        activity_type: '訪問',
        activity_date: new Date('2024-01-14T10:00:00Z'),
        customer_id: 'CUST004',
      },
      {
        activity_id: 'ACT005',
        sales_person_id: 'SP001',
        activity_type: '提案',
        activity_date: new Date('2024-01-16T11:00:00Z'),
        customer_id: 'CUST005',
      },
    ];

    const success_pattern_data = [
      {
        pattern_id: 'PAT001',
        pattern_name: '初回接触から提案までの成功パターン',
        days_to_proposal: 2,
        success_rate: 0.75,
      },
      {
        pattern_id: 'PAT002',
        pattern_name: '提案から受注までの成功パターン',
        days_to_contract: 3,
        success_rate: 0.68,
      },
    ];

    // Act
    const report = generateSalesActivityPatternAnalysisReport({
      sales_person_id,
      analysis_start_date,
      analysis_end_date,
      activity_data,
      success_pattern_data,
    });

    // Assert
    expect(report.analysis_period_start).toEqual(new Date('2024-01-15T00:00:00Z'));
    expect(report.analysis_period_end).toEqual(new Date('2024-01-15T23:59:59Z'));

    expect(report.aggregated_activity_count).toBe(3);
    expect(report.visit_count).toBe(1);
    expect(report.proposal_count).toBe(1);
    expect(report.contract_count).toBe(1);

    expect(report.aggregated_activities).toHaveLength(3);
    expect(report.aggregated_activities.map((a: any) => a.activity_id)).toEqual([
      'ACT001',
      'ACT002',
      'ACT003',
    ]);

    expect(report.excluded_activities).toHaveLength(2);
    expect(report.excluded_activities.map((a: any) => a.activity_id)).toEqual([
      'ACT004',
      'ACT005',
    ]);

    expect(report.sales_person_id).toBe('SP001');
    expect(report.report_generated_at).toBeDefined();
    expect(typeof report.report_generated_at).toBe('object');
  });
});