import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-096: [normal] 営業担当者別行動パターン分析レポート機能 - データ蓄積量確認完了時に営業担当者別の行動パターン分析レポートが正常に生成される
  test('過去90日間のデータ蓄積が閾値に達した場合、営業担当者別の行動パターン分析レポートが正常に生成される', () => {
    const reporting_period_end_date = new Date('2024-03-31T23:59:59Z');
    const reporting_period_start_date = new Date('2024-01-01T00:00:00Z');

    const sales_person_a_id = 'SP_A_001';
    const sales_person_b_id = 'SP_B_002';

    const sales_person_a_behavior_data = [
      { behavior_type: 'visit', count: 20 },
      { behavior_type: 'phone_call', count: 30 },
      { behavior_type: 'email', count: 50 },
      { behavior_type: 'proposal_document', count: 10 },
    ];

    const sales_person_b_behavior_data = [
      { behavior_type: 'visit', count: 15 },
      { behavior_type: 'phone_call', count: 40 },
      { behavior_type: 'email', count: 35 },
      { behavior_type: 'proposal_document', count: 20 },
    ];

    const total_behaviors_a = 20 + 30 + 50 + 10;
    const total_behaviors_b = 15 + 40 + 35 + 20;

    const input_params = {
      target_period_start: reporting_period_start_date,
      target_period_end: reporting_period_end_date,
      aggregation_unit: 'sales_person',
      sales_person_behaviors: [
        {
          sales_person_id: sales_person_a_id,
          behaviors: sales_person_a_behavior_data,
        },
        {
          sales_person_id: sales_person_b_id,
          behaviors: sales_person_b_behavior_data,
        },
      ],
    };

    const result = generateSalesPersonBehaviorAnalysisReport(input_params);

    expect(result.report_status).toBe('completed');
    expect(result.report_data).toBeDefined();

    const report_data = result.report_data;
    expect(report_data.aggregation_unit).toBe('sales_person');
    expect(report_data.period_start).toEqual(reporting_period_start_date);
    expect(report_data.period_end).toEqual(reporting_period_end_date);

    expect(Array.isArray(report_data.sales_person_analysis)).toBe(true);
    expect(report_data.sales_person_analysis.length).toBe(2);

    const analysis_a = report_data.sales_person_analysis.find(
      (a) => a.sales_person_id === sales_person_a_id
    );
    expect(analysis_a).toBeDefined();
    expect(analysis_a.visit_frequency).toBe(20);
    expect(analysis_a.visit_percentage).toBe(22);
    expect(analysis_a.phone_call_frequency).toBe(30);
    expect(analysis_a.phone_call_percentage).toBe(33);
    expect(analysis_a.email_frequency).toBe(50);
    expect(analysis_a.email_percentage).toBe(56);
    expect(analysis_a.proposal_document_frequency).toBe(10);
    expect(analysis_a.proposal_document_percentage).toBe(11);
    expect(analysis_a.primary_behavior_type).toBe('email');
    expect(analysis_a.behavior_pattern_classification).toBe('email_focused');

    const analysis_b = report_data.sales_person_analysis.find(
      (a) => a.sales_person_id === sales_person_b_id
    );
    expect(analysis_b).toBeDefined();
    expect(analysis_b.visit_frequency).toBe(15);
    expect(analysis_b.visit_percentage).toBe(15);
    expect(analysis_b.phone_call_frequency).toBe(40);
    expect(analysis_b.phone_call_percentage).toBe(40);
    expect(analysis_b.email_frequency).toBe(35);
    expect(analysis_b.email_percentage).toBe(35);
    expect(analysis_b.proposal_document_frequency).toBe(20);
    expect(analysis_b.proposal_document_percentage).toBe(20);
    expect(analysis_b.primary_behavior_type).toBe('phone_call');
    expect(analysis_b.behavior_pattern_classification).toBe('phone_and_proposal_focused');

    const generated_timestamp = new Date(result.generated_at);
    const current_time = new Date('2024-03-31T23:59:59Z');
    const time_diff_minutes = Math.abs(
      (generated_timestamp.getTime() - current_time.getTime()) / (1000 * 60)
    );
    expect(time_diff_minutes).toBeLessThanOrEqual(5);
  });
});