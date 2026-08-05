import { aggregatePracticalApplicationStatuses } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の実務適用状況集計機能', () => {
  // SCEN-1008
  test('実務適用報告が複数件の場合、全営業担当者の適用状況が正しく集計される', () => {
    const sales_rep_a_id = 'sales_rep_a_001';
    const sales_rep_b_id = 'sales_rep_b_001';
    const sales_rep_c_id = 'sales_rep_c_001';

    const practical_application_reports = [
      {
        sales_rep_id: sales_rep_a_id,
        application_status: 'applied',
        report_id: 'report_001',
      },
      {
        sales_rep_id: sales_rep_a_id,
        application_status: 'planned',
        report_id: 'report_002',
      },
      {
        sales_rep_id: sales_rep_a_id,
        application_status: 'not_applied',
        report_id: 'report_003',
      },
      {
        sales_rep_id: sales_rep_b_id,
        application_status: 'applied',
        report_id: 'report_004',
      },
      {
        sales_rep_id: sales_rep_b_id,
        application_status: 'applied',
        report_id: 'report_005',
      },
      {
        sales_rep_id: sales_rep_c_id,
        application_status: 'planned',
        report_id: 'report_006',
      },
    ];

    const result = aggregatePracticalApplicationStatuses(
      practical_application_reports
    );

    expect(result.by_sales_rep).toEqual({
      [sales_rep_a_id]: {
        applied: 1,
        planned: 1,
        not_applied: 1,
      },
      [sales_rep_b_id]: {
        applied: 2,
        planned: 0,
        not_applied: 0,
      },
      [sales_rep_c_id]: {
        applied: 0,
        planned: 1,
        not_applied: 0,
      },
    });

    expect(result.summary).toEqual({
      total_applied: 3,
      total_planned: 2,
      total_not_applied: 1,
      total_reports: 6,
    });
  });
});