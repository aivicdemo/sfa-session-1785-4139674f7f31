import { calculateProblemSeverityScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-804
  test('[edge] 問題検出結果の重要度・優先度分類機能 - 重要度スコアが計算結果として端数を含む場合、正しく丸められる', () => {
    const problem_detection_result = {
      problem_id: 'prob_001',
      detected_issue: '提案内容が標準プロセスから逸脱',
      issue_type: 'process_deviation',
      impact_count: 3,
      total_case_count: 10,
      risk_factor_score: 7.2,
      frequency_score: 9.8,
      customer_impact_flag: true,
    };

    const result = calculateProblemSeverityScore(problem_detection_result);

    const expected_raw_severity_score = (7.2 * 0.4) + (9.8 * 0.6);
    const expected_severity_score_rounded = 8.5;
    const expected_priority_classification = 'high';

    expect(result.severity_score).toBe(expected_severity_score_rounded);
    expect(result.priority_classification).toBe(expected_priority_classification);
    expect(result.problem_id).toBe('prob_001');
  });
});