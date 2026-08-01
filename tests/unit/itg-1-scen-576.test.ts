import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-576
  test('優先度スコアの計算機能 - 問題の期限が欠けている場合、計算が失敗する', () => {
    const problemWithoutDeadline = {
      id: 'problem-001',
      severity: 'high',
      frequency: 5,
      deadline: null,
      impact: 3,
    };

    expect(() => calculatePriorityScore(problemWithoutDeadline)).toThrow(/期限/);
  });
});