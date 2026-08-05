import { validateIssueReview } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-827
  test('検出された問題の重要度が欠落している場合にエラーになること', () => {
    const issue_detection_result = {
      issue_id: 'issue_001',
      category: 'process_deviation',
      description: 'Proposal content deviates from standard process',
      severity: null,
    };

    expect(() => validateIssueReview(issue_detection_result)).toThrow(/severity/);
  });
});