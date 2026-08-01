import { describe, test, expect } from '@jest/globals';
import { calculateSeverityScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-570
  test('重要度スコアの計算機能 - 問題要因の重みが欠けている場合、計算が失敗する', () => {
    const problemFactorWithoutWeight = {
      id: 'factor-001',
      name: '提案精度の低下',
      weight: null,
      frequency: 5,
      impact: 8,
    };

    expect(() => calculateSeverityScore(problemFactorWithoutWeight)).toThrow(/重み/);
  });
});