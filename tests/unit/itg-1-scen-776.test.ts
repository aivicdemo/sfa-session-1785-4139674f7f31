import { classifyProblemDetectionResult } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-776
  test('[normal] 問題検出結果の重要度・優先度分類機能 - 高重要度・高優先度の問題は対応対象として即座の対応が必要と判定される', () => {
    const problem_detection_result = {
      detection_id: 'det-001',
      severity: 'high',
      priority: 'high',
      detected_at: new Date('2024-01-15T10:00:00Z'),
      description: 'プロセス逸脱検出',
    };

    const classified_result = classifyProblemDetectionResult(problem_detection_result);

    expect(classified_result.action_status).toBe('対応対象');
    expect(classified_result.action_deadline).toEqual(new Date('2024-01-18T17:00:00Z'));
  });
});