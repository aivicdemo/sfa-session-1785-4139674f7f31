import { classifyDetectionResultsByPriorityAndSeverity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-525
  test('問題検出結果の重要度・優先度分類機能 - 同じ優先度の問題が複数ある場合、優先度内での重要度で正しく順序付けされる', () => {
    const detectionResults = [
      {
        problem_id: 'PROB_A',
        priority: 2,
        severity: 8,
        description: '問題A',
        timestamp: new Date('2024-01-15T11:00:00Z'),
      },
      {
        problem_id: 'PROB_B',
        priority: 2,
        severity: 5,
        description: '問題B',
        timestamp: new Date('2024-01-15T11:05:00Z'),
      },
      {
        problem_id: 'PROB_C',
        priority: 2,
        severity: 9,
        description: '問題C',
        timestamp: new Date('2024-01-15T11:10:00Z'),
      },
    ];

    const result = classifyDetectionResultsByPriorityAndSeverity(detectionResults);

    expect(result).toHaveLength(3);
    expect(result[0].problem_id).toBe('PROB_C');
    expect(result[0].severity).toBe(9);
    expect(result[1].problem_id).toBe('PROB_A');
    expect(result[1].severity).toBe(8);
    expect(result[2].problem_id).toBe('PROB_B');
    expect(result[2].severity).toBe(5);
  });
});