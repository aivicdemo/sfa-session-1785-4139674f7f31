import { classifyProblemPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-528
  test('問題検出結果の重要度・優先度分類機能 - 問題の優先度値が欠けている場合、処理が失敗する', () => {
    const problemWithMissingPriority = {
      problemId: 'PROB-001',
      severityLevel: 'high',
      detectionDateTime: '2024-01-15T10:30:00Z',
      priorityValue: null,
      description: 'Test problem',
      detectedBy: 'AI-Agent-001'
    };

    expect(() => classifyProblemPriority(problemWithMissingPriority)).toThrow(/優先度値/);
  });
});