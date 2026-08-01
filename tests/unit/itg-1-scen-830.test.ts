import { analyzeProcessDeviationCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業プロセス標準書との乖離分析と成約実績の相関分析', () => {
  test('SCEN-830: 乖離度スコアと成約率の相関を負の相関から正の相関まで判別する', () => {
    // テストデータ準備: 5パターンの営業活動データセット
    const standardProcessDefinition = {
      target_contact_frequency_weekly: 3,
      target_proposal_count_monthly: 5,
      target_followup_days: 14,
    };

    const patternA = {
      pattern_id: 'A',
      name: '標準書準拠',
      activities: Array.from({ length: 50 }, (_, i) => ({
        sales_rep_id: `rep_a_${i}`,
        contact_frequency_weekly: 3,
        proposal_count_monthly: 5,
        followup_days: 12,
        deal_amount: 100000,
      })),
      conversion_rate: 0.08,
      deviation_score: 0.05,
    };

    const patternB = {
      pattern_id: 'B',
      name: '軽微乖離',
      activities: Array.from({ length: 50 }, (_, i) => ({
        sales_rep_id: `rep_b_${i}`,
        contact_frequency_weekly: 2.8,
        proposal_count_monthly: 4.5,
        followup_days: 15,
        deal_amount: 95000,
      })),
      conversion_rate: 0.075,
      deviation_score: -0.15,
    };

    const patternC = {
      pattern_id: 'C',
      name: '中程度乖離',
      activities: Array.from({ length: 50 }, (_, i) => ({
        sales_rep_id: `rep_c_${i}`,
        contact_frequency_weekly: 2.2,
        proposal_count_monthly: 3.8,
        followup_days: 21,
        deal_amount: 88000,
      })),
      conversion_rate: 0.062,
      deviation_score: -0.4,
    };

    const patternD = {
      pattern_id: 'D',
      name: '大幅乖離',
      activities: Array.from({ length: 50 }, (_, i) => ({
        sales_rep_id: `rep_d_${i}`,
        contact_frequency_weekly: 1.2,
        proposal_count_monthly: 2.1,
        followup_days: 35,
        deal_amount: 72000,
      })),
      conversion_rate: 0.041,
      deviation_score: -0.75,
    };

    const patternE = {
      pattern_id: 'E',
      name: '独自手法で標準書逆行',
      activities: Array.from({ length: 50 }, (_, i) => ({
        sales_rep_id: `rep_e_${i}`,
        contact_frequency_weekly: 1.5,
        proposal_count_monthly: 3.2,
        followup_days: 28,
        deal_amount: 120000,
      })),
      conversion_rate: 0.093,
      deviation_score: 0.6,
    };

    const allPatterns = [patternA, patternB, patternC, patternD, patternE];

    const analysisInput = {
      standard_process_definition: standardProcessDefinition,
      data_patterns: allPatterns,
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-12-31',
      target_sales_reps: [
        'rep_a_0',
        'rep_b_0',
        'rep_c_0',
        'rep_d_0',
        'rep_e_0',
      ],
      correlation_calculation_method: 'pearson',
      deviation_items: [
        'contact_frequency',
        'proposal_count',
        'followup_days',
      ],
    };

    const result = analyzeProcessDeviationCorrelation(analysisInput);

    // 検証: 相関係数がパターン別に期待値内であること
    const correlationResults = result.correlation_analysis_results;

    // パターンA: 標準書準拠、相関≈0に近い（目安: -0.2～0.2）
    const correlationA = correlationResults.find(
      (r) => r.pattern_id === 'A'
    );
    expect(correlationA).toBeDefined();
    expect(correlationA!.correlation_coefficient).toBeGreaterThanOrEqual(-0.2);
    expect(correlationA!.correlation_coefficient).toBeLessThanOrEqual(0.2);

    // パターンB: 軽微乖離、負の相関（-0.65以下）
    const correlationB = correlationResults.find(
      (r) => r.pattern_id === 'B'
    );
    expect(correlationB).toBeDefined();
    expect(correlationB!.correlation_coefficient).toBeLessThanOrEqual(-0.5);

    // パターンC: 中程度乖離、負の相関（-0.65以下）
    const correlationC = correlationResults.find(
      (r) => r.pattern_id === 'C'
    );
    expect(correlationC).toBeDefined();
    expect(correlationC!.correlation_coefficient).toBeLessThanOrEqual(-0.6);

    // パターンD: 大幅乖離、負の相関（-0.65以下）
    const correlationD = correlationResults.find(
      (r) => r.pattern_id === 'D'
    );
    expect(correlationD).toBeDefined();
    expect(correlationD!.correlation_coefficient).toBeLessThanOrEqual(-0.65);

    // パターンE: 独自手法で標準書逆行、正の相関（+0.55以上）
    const correlationE = correlationResults.find(
      (r) => r.pattern_id === 'E'
    );
    expect(correlationE).toBeDefined();
    expect(correlationE!.correlation_coefficient).toBeGreaterThanOrEqual(0.55);

    // 検証: 相関係数が小数第2位まで算出されていること
    correlationResults.forEach((corr) => {
      const decimalPlaces = (corr.correlation_coefficient.toString()
        .split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    // 検証: 負の相関が検出されたパターン（B, C, D）について、具体的乖離項目が記録されていること
    const negativeCorrelationPatterns = correlationResults.filter(
      (r) => r.correlation_coefficient < -0.5
    );
    expect(negativeCorrelationPatterns.length).toBeGreaterThanOrEqual(3);
    negativeCorrelationPatterns.forEach((pattern) => {
      expect(pattern.detected_deviation_items).toBeDefined();
      expect(Array.isArray(pattern.detected_deviation_items)).toBe(true);
      expect(pattern.detected_deviation_items.length).toBeGreaterThan(0);
    });

    // 検証: 正の相関が検出されたパターン（E）について、成功要因が記録されていること
    expect(correlationE!.identified_success_factors).toBeDefined();
    expect(Array.isArray(correlationE!.identified_success_factors)).toBe(true);
    expect(correlationE!.identified_success_factors.length).toBeGreaterThan(0);

    // 検証: レポートに分析ロジックの根拠が含まれていること
    expect(result.analysis_report).toBeDefined();
    expect(result.analysis_report.dataset_info).toBeDefined();
    expect(result.analysis_report.dataset_info.total_records).toBe(250);
    expect(result.analysis_report.dataset_info.analysis_period_start).toBe(
      '2024-01-01'
    );
    expect(result.analysis_report.dataset_info.analysis_period_end).toBe(
      '2024-12-31'
    );
    expect(result.analysis_report.dataset_info.deviation_detection_items).toEqual(
      ['contact_frequency', 'proposal_count', 'followup_days']
    );

    // 検証: 計算式が記録されていること
    expect(result.analysis_report.calculation_formula).toBeDefined();
    expect(result.analysis_report.calculation_formula).toContain('pearson');

    // 検証: 各相関値と根拠が分析結果に含まれていること
    expect(result.analysis_report.pattern_correlations).toBeDefined();
    expect(result.analysis_report.pattern_correlations.length).toBe(5);
    result.analysis_report.pattern_correlations.forEach((patternReport) => {
      expect(patternReport.pattern_id).toBeDefined();
      expect(patternReport.correlation_coefficient).toBeDefined();
      expect(typeof patternReport.correlation_coefficient).toBe('number');
      expect(patternReport.dataset_size).toBeGreaterThan(0);
    });

    // 検証: 各パターンの相関係数が期待値と一致すること
    const reportPatternA = result.analysis_report.pattern_correlations.find(
      (p) => p.pattern_id === 'A'
    );
    expect(reportPatternA!.correlation_coefficient).toBeGreaterThanOrEqual(-0.2);
    expect(reportPatternA!.correlation_coefficient).toBeLessThanOrEqual(0.2);

    const reportPatternB = result.analysis_report.pattern_correlations.find(
      (p) => p.pattern_id === 'B'
    );
    expect(reportPatternB!.correlation_coefficient).toBeLessThanOrEqual(-0.5);

    const reportPatternE = result.analysis_report.pattern_correlations.find(
      (p) => p.pattern_id === 'E'
    );
    expect(reportPatternE!.correlation_coefficient).toBeGreaterThanOrEqual(0.55);
  });
});