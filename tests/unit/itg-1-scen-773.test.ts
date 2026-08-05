import { jest } from '@jest/globals';
import { classifyDetectedIssuesByPriorityAndSeverity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-773
  test('[normal] 問題検出結果の重要度・優先度分類機能 - 検出された問題が0件の場合、空のリストが返される', () => {
    const detected_issues: [] = [];

    const result = classifyDetectedIssuesByPriorityAndSeverity(detected_issues);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});