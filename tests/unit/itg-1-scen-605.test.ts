import { describe, test, expect } from '@jest/globals';
import { judgeIssueSeverityAndResponseNecessity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-605: [error] 問題検出結果の重要度・対応必要性判定機能 - 重要度スコアが数値として有効な範囲外の場合エラーとして拒否される
  test('should reject severity score outside 0-100 range', () => {
    const invalidScores = [-1, 101, 999, -999.99];

    invalidScores.forEach((severityScore) => {
      expect(() =>
        judgeIssueSeverityAndResponseNecessity({
          severityScore,
          detectionFrequency: 5,
          issuePatternCount: 3,
        })
      ).toThrow(/重要度スコアは0から100の範囲で指定してください/);
    });
  });
});