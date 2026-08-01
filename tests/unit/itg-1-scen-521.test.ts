import { detectAndClassifyProblems } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-521: [edge] 問題検出結果の重要度・優先度分類機能 - 問題が1件検出された場合、その問題が正しく分類される
  test('should correctly classify a single detected problem with severity high, priority 1, and category ProcessDeviation', () => {
    const detectedProblems = [
      {
        id: 'problem-001',
        type: 'process_violation',
        score: 85,
        timestamp: new Date('2024-01-15T11:00:00Z'),
        salesPersonId: 'sp-001',
        description: '営業プロセス違反',
      },
    ];

    const classificationResult = detectAndClassifyProblems(detectedProblems);

    expect(classificationResult).toHaveLength(1);
    expect(classificationResult[0]).toEqual({
      problemId: 'problem-001',
      severity: 'high',
      priority: 1,
      category: 'ProcessDeviation',
      score: 85,
      timestamp: new Date('2024-01-15T11:00:00Z'),
      salesPersonId: 'sp-001',
      description: '営業プロセス違反',
    });
  });
});