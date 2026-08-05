import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1047
  test('理解度スコアが閾値直下 99.9% で周知完了判定が偽になる', () => {
    const sales_rep_id = 'SR-001';
    const sales_rep_name = '山田太郎';
    const comprehension_score = 99.9;
    const awareness_completion_threshold = 99.95;
    const success_pattern_guide_version = 'v2024-01-15';
    const training_completion_date = new Date('2024-01-10T09:00:00Z');
    const report_generated_date = new Date('2024-01-15T14:30:00Z');

    const result = generateSalesRepBehaviorAnalysisReport({
      sales_rep_id,
      sales_rep_name,
      comprehension_score,
      awareness_completion_threshold,
      success_pattern_guide_version,
      training_completion_date,
      report_generated_date,
    });

    expect(result.sales_rep_id).toBe('SR-001');
    expect(result.sales_rep_name).toBe('山田太郎');
    expect(result.comprehension_score).toBe(99.9);
    expect(result.awareness_completion_threshold).toBe(99.95);
    expect(result.is_awareness_completed).toBe(false);
    expect(result.success_pattern_guide_version).toBe('v2024-01-15');
    expect(typeof result.report_generated_date).toBe('object');
  });
});