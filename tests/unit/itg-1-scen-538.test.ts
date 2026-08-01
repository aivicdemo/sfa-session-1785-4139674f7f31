import { determineResponseTiming } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-538: [edge] 問題対応タイミングの判定機能 - 問題の重要度が対応時期判定の基準値ちょうどの場合、対応時期が正しく判定される
  test('重要度が基準値ちょうどの場合、対応時期が正しく判定される', () => {
    const problem_severity = 3;
    const response_timing_threshold = 3;
    const expected_timing = '即日対応';

    const result = determineResponseTiming({
      severity: problem_severity,
      threshold: response_timing_threshold,
    });

    expect(result).toBe(expected_timing);
  });
});