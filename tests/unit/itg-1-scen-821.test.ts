import { judgeIssueSeverity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-821: 提案内容カテゴリのみの問題検出時に重要度中で判定される', () => {
    // Arrange: 提案内容（proposal）カテゴリのみの問題を含むデータセットを準備
    const detectedIssues = [
      {
        issueId: 'issue-001',
        category: 'proposal',
        severity: 'low',
        description: '提案金額が顧客予算上限を超過している',
        detectedAt: new Date('2024-01-15T11:00:00Z'),
        rootCause: '提案内容の金額設定ロジックに誤りがある可能性',
      },
    ];

    // Act: 重要度判定関数を実行
    const result = judgeIssueSeverity(detectedIssues);

    // Assert: 返却された判定結果を検証
    expect(result).toEqual({
      overallSeverity: 'MEDIUM',
      reason: '提案内容に改善が必要な問題が検出されました',
      requiresAction: true,
      affectedCategory: 'proposal',
      issueCount: 1,
    });
  });
});