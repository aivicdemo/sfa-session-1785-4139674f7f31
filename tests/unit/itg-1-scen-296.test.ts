import { judgeCoachingPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-296: 標準プロセスとの乖離度が許容範囲の上限直上（+10.01%）の場合、改善指導対象として判定される', () => {
    const tolerance_limit_percent = 10.0;
    const deviation_percent = 10.01;
    const sales_rep_id = 'SR_001';
    const rep_name = 'Tanaka Hanako';
    const process_compliance_score = 89.99;

    const result = judgeCoachingPriority({
      sales_rep_id: sales_rep_id,
      rep_name: rep_name,
      deviation_from_standard_process_percent: deviation_percent,
      tolerance_limit_percent: tolerance_limit_percent,
      process_compliance_score: process_compliance_score,
    });

    expect(result.is_coaching_target).toBe(true);
    expect(result.priority_level).toBe('high');
    expect(result.priority_score).toBe(95);
    expect(result.sales_rep_id).toBe(sales_rep_id);
    expect(result.deviation_from_standard_process_percent).toBe(deviation_percent);
    expect(result.tolerance_exceeded_by_percent).toBeCloseTo(0.01, 5);
  });
});