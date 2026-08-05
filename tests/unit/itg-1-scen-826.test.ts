import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { reviewAndJudgeProblemDetectionResult } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-826
  test('問題検出結果のレビュー・判定機能 - 営業管理職のユーザーIDが空文字列の場合にエラーになること', () => {
    const problem_detection_result_id = 'pdr_20240115_001';
    const manager_user_id = '';
    const judgment_content = '提案内容が顧客ニーズと乖離している。顧客への事前ヒアリングを強化するよう指導が必要。';
    const judgment_date = new Date('2024-01-15T14:30:00Z');
    const judgment_importance = 'high';
    const judgment_necessity = true;

    expect(() =>
      reviewAndJudgeProblemDetectionResult({
        problem_detection_result_id,
        manager_user_id,
        judgment_content,
        judgment_date,
        judgment_importance,
        judgment_necessity,
      })
    ).toThrow(/USER_ID_EMPTY/);
  });
});