import { describe, test, expect } from '@jest/globals';
import { calculateProblemSeverityAndActionRequired } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-606: 問題検出結果の重要度・対応必要性判定機能 - 負数スコア入力時エラー
  test('重要度スコアが負数である場合、バリデーションエラーが返却されること', () => {
    const invalidInput = {
      detectionResultId: 'detect-001',
      severityScore: -5,
      detectionFrequency: 3,
      inferenceLogId: 'inference-log-001',
      timestamp: '2024-01-15T11:00:00Z'
    };

    expect(() =>
      calculateProblemSeverityAndActionRequired(invalidInput)
    ).toThrow(/重要度スコア/);
  });
});