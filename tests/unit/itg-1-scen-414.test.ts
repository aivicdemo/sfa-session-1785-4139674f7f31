import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-414
  test('レポートに含まれる合致度の値が0.0の場合、正確に表示される', () => {
    const sales_rep_id = 'SR-001';
    const sales_rep_name = '田中太郎';
    const analysis_start_date = '2024-01-01';
    const analysis_end_date = '2024-01-31';
    const matching_score = 0.0;

    const input = {
      sales_rep_id,
      sales_rep_name,
      analysis_start_date,
      analysis_end_date,
    };

    const report = generateBehaviorPatternAnalysisReport(input);

    expect(report).toBeDefined();
    expect(report.matching_score).toBe(0.0);
    expect(typeof report.matching_score).toBe('number');
    expect(Number.isNaN(report.matching_score)).toBe(false);
    expect(report.sales_rep_id).toBe(sales_rep_id);
    expect(report.sales_rep_name).toBe(sales_rep_name);
    expect(report.analysis_period.start_date).toBe(analysis_start_date);
    expect(report.analysis_period.end_date).toBe(analysis_end_date);
    expect(report.output_format).toMatch(/json|pdf|html/i);
    expect(report.error_flag).toBe(false);
  });
});