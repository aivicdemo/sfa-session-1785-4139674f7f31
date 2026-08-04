import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-785: [normal] 推奨信頼度スコア算出機能 - 信頼度スコアが0以上100以下の整数で正規化される
  test('should normalize confidence scores to integer range [0, 100]', () => {
    const testCases = [
      { input: 150, expected: 100 },
      { input: -5, expected: 0 },
      { input: 0, expected: 0 },
      { input: 50, expected: 50 },
      { input: 100, expected: 100 },
      { input: 99.5, expected: 99 },
    ];

    testCases.forEach((testCase) => {
      const result = calculateRecommendationConfidenceScore(testCase.input);
      expect(result).toBe(testCase.expected);
      expect(typeof result).toBe('number');
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });
});