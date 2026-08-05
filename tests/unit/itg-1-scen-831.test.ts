import { validateProblemDetectionReviewJudgment } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-831
  test('対応必要性の判定結果が欠落している場合にエラーになること', () => {
    const problem_detection_result = {
      detection_id: 'det_001',
      problem_type: '提案内容の不適切',
      severity: 'high',
      detected_at: new Date('2024-01-15T10:30:00Z'),
      salesperson_id: 'sales_001',
      judgment_result: undefined,
      judgment_timestamp: new Date('2024-01-15T11:00:00Z'),
      reviewer_id: 'mgr_001',
    };

    expect(() => validateProblemDetectionReviewJudgment(problem_detection_result)).toThrow(/対応必要性の判定結果/);
  });
});