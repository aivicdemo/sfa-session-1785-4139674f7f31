import { calculateDeviationDegreeAndPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-294: [edge] 行動パターン分析と改善指導優先順位判定機能 - 標準プロセスとの乖離度が許容範囲の上限ちょうど（例：+10%）の場合、改善指導対象外と判定される
  test('標準プロセス処理時間との乖離度が許容範囲の上限ちょうど(+10%)の場合、改善指導対象外と判定される', () => {
    const standard_process_time_minutes = 100;
    const actual_process_time_minutes = 110;
    const tolerance_threshold_percent = 10;

    const result = calculateDeviationDegreeAndPriority({
      standard_process_time_minutes,
      actual_process_time_minutes,
      tolerance_threshold_percent,
    });

    expect(result.deviation_degree_percent).toBe(10);
    expect(result.requires_improvement_guidance).toBe(false);
    expect(result.improvement_priority_level).toBeNull();
  });
});