import { calculateProblemReportingDecision } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-844
  test('重要度スコアが報告閾値未満のとき非報告対象に判定される', () => {
    const problem_detection_result = {
      problem_id: 'prob_001',
      severity_score: 69.9,
      root_cause: 'データ品質異常：顧客マスタ重複率5.2%',
      impact_scope: 'single_salesperson',
      detection_timestamp: new Date('2024-01-15T10:00:00Z').toISOString(),
    };

    const reporting_threshold = 70;

    const decision_result = calculateProblemReportingDecision(
      problem_detection_result,
      reporting_threshold
    );

    expect(decision_result.should_report).toBe(false);
    expect(decision_result.status).toBe('非報告対象（スコア:69.9点、閾値:70点未満）');
    expect(decision_result.severity_score).toBe(69.9);
    expect(decision_result.reporting_threshold).toBe(70);
  });
});