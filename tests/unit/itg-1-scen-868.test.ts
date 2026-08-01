import { analyzeProcessDeviationAndCorrelateWithClosureRate } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-868
  test('プロセス標準からの乖離が成約率向上に貢献する場合、分析結果にその旨を記載する', () => {
    const sales_rep_a_activities = [
      {
        sales_rep_id: 'A',
        activity_type: 'initial_contact',
        activity_date: new Date('2024-01-10'),
        contact_count: 1,
      },
      {
        sales_rep_id: 'A',
        activity_type: 'proposal',
        activity_date: new Date('2024-01-15'),
        contact_count: 1,
      },
      {
        sales_rep_id: 'A',
        activity_type: 'negotiation',
        activity_date: new Date('2024-01-20'),
        contact_count: 1,
      },
      {
        sales_rep_id: 'A',
        activity_type: 'closure',
        activity_date: new Date('2024-01-25'),
        contact_count: 1,
      },
    ];

    const sales_rep_b_activities = [
      {
        sales_rep_id: 'B',
        activity_type: 'initial_contact',
        activity_date: new Date('2024-01-10'),
        contact_count: 1,
      },
      {
        sales_rep_id: 'B',
        activity_type: 'needs_analysis',
        activity_date: new Date('2024-01-12'),
        contact_count: 1,
      },
      {
        sales_rep_id: 'B',
        activity_type: 'proposal_preparation',
        activity_date: new Date('2024-01-14'),
        contact_count: 1,
      },
      {
        sales_rep_id: 'B',
        activity_type: 'proposal',
        activity_date: new Date('2024-01-16'),
        contact_count: 1,
      },
      {
        sales_rep_id: 'B',
        activity_type: 'negotiation',
        activity_date: new Date('2024-01-20'),
        contact_count: 1,
      },
      {
        sales_rep_id: 'B',
        activity_type: 'closure',
        activity_date: new Date('2024-01-25'),
        contact_count: 1,
      },
    ];

    const sales_rep_c_activities = [
      {
        sales_rep_id: 'C',
        activity_type: 'initial_contact',
        activity_date: new Date('2024-01-10'),
        contact_count: 1,
      },
      {
        sales_rep_id: 'C',
        activity_type: 'proposal',
        activity_date: new Date('2024-01-16'),
        contact_count: 1,
      },
      {
        sales_rep_id: 'C',
        activity_type: 'negotiation',
        activity_date: new Date('2024-01-20'),
        contact_count: 1,
      },
      {
        sales_rep_id: 'C',
        activity_type: 'closure',
        activity_date: new Date('2024-01-25'),
        contact_count: 1,
      },
    ];

    const standard_process_steps = [
      'initial_contact',
      'needs_analysis',
      'proposal_preparation',
      'proposal',
      'negotiation',
      'closure',
    ];

    const closure_results = [
      {
        sales_rep_id: 'A',
        closure_count: 17,
        total_opportunities: 20,
        closure_rate: 0.85,
      },
      {
        sales_rep_id: 'B',
        closure_count: 36,
        total_opportunities: 50,
        closure_rate: 0.72,
      },
      {
        sales_rep_id: 'C',
        closure_count: 17,
        total_opportunities: 25,
        closure_rate: 0.68,
      },
    ];

    const all_activities = [
      ...sales_rep_a_activities,
      ...sales_rep_b_activities,
      ...sales_rep_c_activities,
    ];

    const analysis_result = analyzeProcessDeviationAndCorrelateWithClosureRate({
      sales_activities: all_activities,
      standard_process_steps: standard_process_steps,
      closure_results: closure_results,
    });

    expect(analysis_result.report_type).toBe('process_deviation_correlation');
    expect(analysis_result.analysis_conclusions.length).toBeGreaterThanOrEqual(1);

    const rep_a_conclusion = analysis_result.analysis_conclusions.find(
      (c: any) => c.sales_rep_id === 'A'
    );
    expect(rep_a_conclusion).toBeDefined();
    expect(rep_a_conclusion.deviation_count).toBe(3);
    expect(rep_a_conclusion.closure_rate).toBe(0.85);
    expect(rep_a_conclusion.correlation_assessment).toMatch(/正の相関/);
    expect(rep_a_conclusion.correlation_assessment).toMatch(/短縮アプローチ/);
    expect(rep_a_conclusion.correlation_assessment).toMatch(/成約率向上/);

    const rep_c_conclusion = analysis_result.analysis_conclusions.find(
      (c: any) => c.sales_rep_id === 'C'
    );
    expect(rep_c_conclusion).toBeDefined();
    expect(rep_c_conclusion.deviation_count).toBe(2);
    expect(rep_c_conclusion.closure_rate).toBe(0.68);
    expect(rep_c_conclusion.correlation_assessment).toMatch(/非有効/);

    expect(analysis_result.evidence_dataset).toBeDefined();
    expect(analysis_result.evidence_dataset.rep_a_activity_count).toBe(4);
    expect(analysis_result.evidence_dataset.rep_a_total_contacts).toBe(4);
    expect(analysis_result.evidence_dataset.rep_b_activity_count).toBe(6);
    expect(analysis_result.evidence_dataset.rep_b_total_contacts).toBe(6);
    expect(analysis_result.evidence_dataset.rep_c_activity_count).toBe(4);
    expect(analysis_result.evidence_dataset.rep_c_total_contacts).toBe(4);
    expect(analysis_result.evidence_dataset.rep_a_days_to_closure).toBe(15);
    expect(analysis_result.evidence_dataset.rep_b_days_to_closure).toBe(15);
    expect(analysis_result.evidence_dataset.rep_c_days_to_closure).toBe(15);
  });
});