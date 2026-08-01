import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-372
  test('[edge] 失敗パターンが0パターンのとき、失敗パターンなしが返される', () => {
    const sales_rep_id = 'SR001';
    const analysis_period_start = '2024-01-01';
    const analysis_period_end = '2024-01-31';
    const success_pattern_count = 5;
    const failure_pattern_count = 0;
    const failure_pattern_details: Array<{
      pattern_id: string;
      description: string;
      occurrence_count: number;
    }> = [];

    const result = generateBehaviorPatternAnalysisReport({
      sales_rep_id,
      analysis_period_start,
      analysis_period_end,
      success_pattern_count,
      failure_pattern_count,
      failure_pattern_details,
    });

    expect(result).toEqual({
      sales_rep_id: 'SR001',
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
      success_pattern_count: 5,
      failure_pattern_count: 0,
      failure_pattern_label: '失敗パターンなし',
      failure_pattern_details: [],
      report_generated_at: expect.any(String),
    });
    expect(result.failure_pattern_label).toBe('失敗パターンなし');
    expect(result.failure_pattern_details).toHaveLength(0);
  });
});