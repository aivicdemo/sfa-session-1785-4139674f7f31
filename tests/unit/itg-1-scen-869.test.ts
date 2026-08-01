import { generateSalesProcessAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-869
  test('標準プロセスからの乖離が成約率低下を招く場合、その旨を分析結果に記載する', () => {
    const standardProcessSteps = [
      { step_id: 1, step_name: '初回訪問', sequence: 1 },
      { step_id: 2, step_name: '提案', sequence: 2 },
      { step_id: 3, step_name: '見積提示', sequence: 3 },
      { step_id: 4, step_name: '商談', sequence: 4 },
      { step_id: 5, step_name: '成約', sequence: 5 },
    ];

    const sales_rep_a_activities = Array.from({ length: 20 }, (_, i) => ({
      sales_rep_id: 'rep_a',
      activity_id: `rep_a_${i + 1}`,
      steps_completed: i < 18 ? [1, 2, 4, 5] : [1, 2, 3, 4, 5],
      is_contracted: i < 3,
      product_category: 'product_x',
      activity_date: new Date('2024-01-01T00:00:00Z').getTime() + i * 86400000,
    }));

    const sales_rep_b_activities = Array.from({ length: 20 }, (_, i) => ({
      sales_rep_id: 'rep_b',
      activity_id: `rep_b_${i + 1}`,
      steps_completed: [1, 2, 3, 4, 5],
      is_contracted: i < 5,
      product_category: 'product_x',
      activity_date: new Date('2024-01-01T00:00:00Z').getTime() + i * 86400000,
    }));

    const sales_rep_c_activities = Array.from({ length: 20 }, (_, i) => ({
      sales_rep_id: 'rep_c',
      activity_id: `rep_c_${i + 1}`,
      steps_completed: [1, 2, 3, 4, 5],
      is_contracted: i < 5,
      product_category: 'product_x',
      activity_date: new Date('2024-01-01T00:00:00Z').getTime() + i * 86400000,
    }));

    const sales_rep_d_activities = Array.from({ length: 20 }, (_, i) => ({
      sales_rep_id: 'rep_d',
      activity_id: `rep_d_${i + 1}`,
      steps_completed: [1, 2, 3, 4, 5],
      is_contracted: i < 6,
      product_category: 'product_x',
      activity_date: new Date('2024-01-01T00:00:00Z').getTime() + i * 86400000,
    }));

    const all_activities = [
      ...sales_rep_a_activities,
      ...sales_rep_b_activities,
      ...sales_rep_c_activities,
      ...sales_rep_d_activities,
    ];

    const analysis_input = {
      standard_process_definition: standardProcessSteps,
      sales_activity_data: all_activities,
      analysis_period_start: new Date('2024-01-01T00:00:00Z'),
      analysis_period_end: new Date('2024-01-31T23:59:59Z'),
      correlation_threshold: 0.75,
    };

    const report = generateSalesProcessAnalysisReport(analysis_input);

    expect(report).toBeDefined();
    expect(report.report_id).toBeDefined();
    expect(report.generated_at).toBeDefined();

    expect(report.deviation_analysis).toBeDefined();
    expect(report.deviation_analysis.sales_rep_deviation_details).toBeDefined();

    const rep_a_deviation = report.deviation_analysis.sales_rep_deviation_details.find(
      (detail: any) => detail.sales_rep_id === 'rep_a'
    );
    expect(rep_a_deviation).toBeDefined();
    expect(rep_a_deviation.deviation_patterns).toContain('見積提示スキップ');
    expect(rep_a_deviation.deviation_patterns).toContain('商談段階短縮');
    expect(rep_a_deviation.deviation_rate_percent).toBe(90);
    expect(rep_a_deviation.total_activities_analyzed).toBe(20);
    expect(rep_a_deviation.deviated_activity_count).toBe(18);

    expect(report.correlation_analysis).toBeDefined();
    expect(report.correlation_analysis.findings).toBeDefined();

    const rep_a_correlation_finding = report.correlation_analysis.findings.find(
      (finding: any) => finding.sales_rep_id === 'rep_a'
    );
    expect(rep_a_correlation_finding).toBeDefined();
    expect(rep_a_correlation_finding.actual_contract_rate_percent).toBe(15);
    expect(rep_a_correlation_finding.deviation_patterns).toContain('見積提示スキップ');
    expect(rep_a_correlation_finding.deviation_patterns).toContain('商談段階短縮');
    expect(rep_a_correlation_finding.correlation_coefficient).toBeCloseTo(0.87, 1);
    expect(rep_a_correlation_finding.correlation_narrative).toMatch(
      /営業担当者rep_aにおいて、見積提示スキップおよび商談段階短縮といった標準プロセスからの乖離が検出されており/
    );
    expect(rep_a_correlation_finding.correlation_narrative).toMatch(/強い相関が認められます/);

    expect(report.improvement_proposals).toBeDefined();
    expect(report.improvement_proposals.proposals_by_sales_rep).toBeDefined();

    const rep_a_proposal = report.improvement_proposals.proposals_by_sales_rep.find(
      (proposal: any) => proposal.sales_rep_id === 'rep_a'
    );
    expect(rep_a_proposal).toBeDefined();
    expect(rep_a_proposal.improvement_narrative).toMatch(/標準プロセスへの準拠により/);
    expect(rep_a_proposal.improvement_narrative).toMatch(/成約率25%程度への改善が期待できます/);
    expect(rep_a_proposal.expected_improvement_rate_percent).toBe(25);
    expect(rep_a_proposal.improvement_potential_numeric).toBe(10);

    expect(report.metadata).toBeDefined();
    expect(report.metadata.dataset_summary).toBeDefined();
    expect(report.metadata.dataset_summary.total_records_analyzed).toBe(80);
    expect(report.metadata.dataset_summary.period_start).toEqual(
      new Date('2024-01-01T00:00:00Z')
    );
    expect(report.metadata.dataset_summary.period_end).toEqual(
      new Date('2024-01-31T23:59:59Z')
    );

    expect(report.metadata.dataset_summary.sales_rep_detail_records).toContainEqual(
      expect.objectContaining({
        sales_rep_id: 'rep_a',
        record_count: 20,
        deviation_count: 18,
      })
    );

    expect(report.metadata.calculation_logic).toBeDefined();
    expect(report.metadata.calculation_logic.deviation_detection_method).toBe(
      'step_sequence_comparison'
    );
    expect(report.metadata.calculation_logic.correlation_calculation_method).toBe(
      'pearson_correlation'
    );
    expect(report.metadata.calculation_logic.improvement_estimate_method).toBe(
      'team_average_benchmark'
    );

    expect(report.metadata.calculation_logic.logic_details).toMatch(
      /標準プロセス定義との比較により乖離を検出/
    );
    expect(report.metadata.calculation_logic.logic_details).toMatch(/ピアソン相関係数を算出/);
    expect(report.metadata.calculation_logic.logic_details).toMatch(
      /チーム平均成約率25%をベンチマーク/
    );
  });
});