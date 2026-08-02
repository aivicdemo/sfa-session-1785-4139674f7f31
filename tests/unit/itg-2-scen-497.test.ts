import { decideDuplicateDetectionRulePriority } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-497: 重複検知ルール実行優先度決定機能 - 優先度スコアが整数のときに小数点が付かない', () => {
    const testCases = [
      { input: 0, expected: '0' },
      { input: 1, expected: '1' },
      { input: 85, expected: '85' },
      { input: 100, expected: '100' },
      { input: 999, expected: '999' },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = decideDuplicateDetectionRulePriority({
        qualityRiskScore: input,
        detectionEfficiencyScore: 50,
      });

      expect(typeof result.priorityScore).toBe('number');
      expect(result.priorityScore.toString()).toBe(expected);
      expect(result.priorityScore.toString()).not.toMatch(/\./);
    });
  });
});