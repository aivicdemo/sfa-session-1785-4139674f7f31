import { describe, test, expect } from '@jest/globals';
import { extractProblems } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-553: 対応すべき問題の抽出機能 - 問題の状態が欠けている場合、処理が失敗する', () => {
    const problemWithoutStatus = {
      problemId: 'P001',
      severity: 'high',
      status: null,
      detectedAt: new Date('2024-01-15T11:00:00Z'),
      description: 'Test problem'
    };

    expect(() => extractProblems([problemWithoutStatus])).toThrow(/問題の状態/);
  });
});