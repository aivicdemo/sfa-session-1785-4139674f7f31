import { extractProblems } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-550: 対応すべき問題の抽出機能 - 問題の状態が対応済みの場合、抽出結果に含まれない', () => {
    const problem_001 = {
      problem_id: 'P001',
      status: '対応済み',
      priority: '高',
      classification: '営業プロセス違反',
    };

    const problem_002 = {
      problem_id: 'P002',
      status: '未対応',
      priority: '高',
      classification: '営業プロセス違反',
    };

    const problems = [problem_001, problem_002];

    const result = extractProblems(problems);

    expect(result).toEqual([
      {
        problem_id: 'P002',
        status: '未対応',
        priority: '高',
        classification: '営業プロセス違反',
      },
    ]);

    expect(result.length).toBe(1);
    expect(result[0].problem_id).toBe('P002');
    expect(result.some((p) => p.problem_id === 'P001')).toBe(false);
  });
});