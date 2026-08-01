import { classifyProblemsByImportanceAndPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-524: [normal] 問題検出結果の重要度・優先度分類機能 - 同じ重要度の問題が複数ある場合、重要度内での優先度で正しく順序付けされる
  test('同じ重要度レベル内で優先度スコアの降順に問題が並ぶ', () => {
    const problemA = {
      id: 'problem-a',
      importance: 'HIGH',
      priorityScore: 85,
      description: 'Issue A',
    };

    const problemB = {
      id: 'problem-b',
      importance: 'HIGH',
      priorityScore: 92,
      description: 'Issue B',
    };

    const problemC = {
      id: 'problem-c',
      importance: 'HIGH',
      priorityScore: 78,
      description: 'Issue C',
    };

    const problems = [problemA, problemB, problemC];

    const classifiedResult = classifyProblemsByImportanceAndPriority(problems);

    const highPriorityGroup = classifiedResult.HIGH;

    expect(highPriorityGroup).toHaveLength(3);
    expect(highPriorityGroup[0].priorityScore).toBe(92);
    expect(highPriorityGroup[0].id).toBe('problem-b');
    expect(highPriorityGroup[1].priorityScore).toBe(85);
    expect(highPriorityGroup[1].id).toBe('problem-a');
    expect(highPriorityGroup[2].priorityScore).toBe(78);
    expect(highPriorityGroup[2].id).toBe('problem-c');
  });
});