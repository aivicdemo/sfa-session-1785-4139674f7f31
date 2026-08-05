import { describe, test, expect } from '@jest/globals';
import { validateProblemDetectionReview } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-825
  test('問題検出結果のレビュー・判定機能 - 営業管理職のユーザーIDが欠落している場合にエラーになること', () => {
    const problem_id = 'PROB_20240115_001';
    const detected_at = new Date('2024-01-15T09:30:00Z');
    const problem_content = '提案内容が標準プロセスから大きく乖離しており、顧客ニーズとの適合度が低い';
    const supervisor_user_id = null;
    const review_status = 'UNDER_REVIEW';

    const problemDetectionReviewInput = {
      problem_id,
      detected_at,
      problem_content,
      supervisor_user_id,
      review_status,
    };

    expect(() => validateProblemDetectionReview(problemDetectionReviewInput)).toThrow(
      /SUPERVISOR_USER_ID_REQUIRED/
    );
  });
});