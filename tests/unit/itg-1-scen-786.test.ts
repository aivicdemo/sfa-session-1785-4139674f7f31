import { classifyAndPrioritizeIssues } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-786
  test('問題検出結果の分類・優先度付け機能 - 問題オブジェクトの重要度が空文字列の場合、エラーになる', () => {
    const issue_with_empty_importance = {
      issue_id: 'ISSUE-001',
      issue_type: 'PROCESS_DEVIATION',
      detected_at: new Date('2024-01-15T10:30:00Z'),
      importance: '',
      description: 'Process deviation detected',
      affected_count: 5,
    };

    expect(() =>
      classifyAndPrioritizeIssues([issue_with_empty_importance])
    ).toThrow(/重要度/);
  });
});