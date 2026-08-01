import { judgeProblemsWithPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-582
  test('複数の問題検出結果について重要度と対応必要性が漏れなく判定される', () => {
    const detectedProblems = [
      {
        problemId: 'prob-001',
        severity: 'high',
        category: 'コンプライアンス違反',
        description: '営業プロセス標準書に違反する行動が検出',
      },
      {
        problemId: 'prob-002',
        severity: 'medium',
        category: 'プロセス逸脱',
        description: '顧客対応フローが定義と異なる',
      },
      {
        problemId: 'prob-003',
        severity: 'low',
        category: '効率低下',
        description: 'フォローアップ間隔が長期化している',
      },
    ];

    const judgmentResults = judgeProblemsWithPriority(detectedProblems);

    expect(judgmentResults).toHaveLength(3);
    expect(judgmentResults.every((r) => r.problemId && r.severityLevel && r.actionRequired)).toBe(
      true,
    );

    const probA = judgmentResults.find((r) => r.problemId === 'prob-001');
    expect(probA).toEqual({
      problemId: 'prob-001',
      severityLevel: '高',
      actionRequired: '即座対応必須',
      category: 'コンプライアンス違反',
    });

    const probB = judgmentResults.find((r) => r.problemId === 'prob-002');
    expect(probB).toEqual({
      problemId: 'prob-002',
      severityLevel: '中',
      actionRequired: '計画的対応推奨',
      category: 'プロセス逸脱',
    });

    const probC = judgmentResults.find((r) => r.problemId === 'prob-003');
    expect(probC).toEqual({
      problemId: 'prob-003',
      severityLevel: '低',
      actionRequired: '監視継続',
      category: '効率低下',
    });

    expect(judgmentResults.length).toBe(detectedProblems.length);
  });
});