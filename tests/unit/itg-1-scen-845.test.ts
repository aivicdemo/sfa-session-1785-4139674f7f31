import { evaluateProblemSeverity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-845: [edge] 問題検出結果の重要度・根拠・対応必要性判定機能 - 重要度スコアが報告閾値超（例：70.1点）のとき報告対象に判定される
  test('重要度スコアが報告閾値を超過した場合、報告対象フラグがtrueで判定根拠が記録される', () => {
    const problem_detection_result = {
      problem_id: 'prob_001',
      severity_score: 70.1,
      root_cause: 'Customer response pattern mismatch with standard process',
      detection_timestamp: '2024-01-15T10:30:00Z',
    };

    const system_config = {
      reporting_threshold: 70.0,
    };

    const judgment_result = evaluateProblemSeverity(
      problem_detection_result,
      system_config
    );

    expect(judgment_result.is_reportable).toBe(true);
    expect(judgment_result.judgment_reason).toMatch(/70\.1/);
    expect(judgment_result.judgment_reason).toMatch(/70\.0/);
    expect(judgment_result.judgment_reason).toMatch(/超過/);
  });
});