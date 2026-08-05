import { validateDetectedIssue } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-828: 問題検出結果のレビュー・判定機能 - 検出された問題の重要度が空文字列の場合にエラーになること', () => {
    const invalidIssueWithEmptySeverity = {
      issue_id: 'ISSUE-001',
      detection_timestamp: '2024-01-15T11:00:00Z',
      sales_rep_id: 'REP-123',
      issue_type: 'process_deviation',
      severity: '',
      description: 'プロセス逸脱が検出されました',
      impact_score: 75,
      confidence_score: 0.92,
      root_cause: '標準プロセスのステップを2つスキップ',
      recommendation: '標準プロセスの再教育が必要',
      review_status: 'pending',
      created_at: '2024-01-15T11:00:00Z',
      updated_at: '2024-01-15T11:00:00Z',
    };

    expect(() => validateDetectedIssue(invalidIssueWithEmptySeverity)).toThrow(/重要度/);
  });
});