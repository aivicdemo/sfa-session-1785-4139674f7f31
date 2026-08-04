import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンテンプレート自動判定機能', () => {
  // SCEN-2591
  test('顧客属性と商談条件が部分的に一致する成功パターンが複数件存在する場合、適合度スコアが高い順にランク付けされて出力される', () => {
    const mockPatternA = {
      patternId: 'pattern-a',
      customerSize: '中堅企業',
      industry: '製造業',
      negotiationPeriodMonths: 3,
      relevanceScore: 0.85,
    };

    const mockPatternB = {
      patternId: 'pattern-b',
      customerSize: '中堅企業',
      industry: '小売業',
      negotiationPeriodMonths: 2,
      relevanceScore: 0.72,
    };

    const mockPatternC = {
      patternId: 'pattern-c',
      customerSize: '大企業',
      industry: '製造業',
      negotiationPeriodMonths: 4,
      relevanceScore: 0.78,
    };

    const mockRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        mockPatternA,
        mockPatternB,
        mockPatternC,
      ]),
    };

    const inputCustomerAttribute = {
      size: '中堅企業',
      industry: '製造業',
    };

    const inputNegotiationCondition = {
      periodMonths: 3,
    };

    const result = findSimilarPatterns(
      inputCustomerAttribute,
      inputNegotiationCondition,
      mockRecommendationEngine
    );

    return result.then((patterns) => {
      expect(patterns).toHaveLength(3);
      expect(patterns[0].relevanceScore).toBe(0.85);
      expect(patterns[0].patternId).toBe('pattern-a');
      expect(patterns[0].customerSize).toBe('中堅企業');
      expect(patterns[0].industry).toBe('製造業');
      expect(patterns[0].negotiationPeriodMonths).toBe(3);

      expect(patterns[1].relevanceScore).toBe(0.78);
      expect(patterns[1].patternId).toBe('pattern-c');
      expect(patterns[1].customerSize).toBe('大企業');
      expect(patterns[1].industry).toBe('製造業');
      expect(patterns[1].negotiationPeriodMonths).toBe(4);

      expect(patterns[2].relevanceScore).toBe(0.72);
      expect(patterns[2].patternId).toBe('pattern-b');
      expect(patterns[2].customerSize).toBe('中堅企業');
      expect(patterns[2].industry).toBe('小売業');
      expect(patterns[2].negotiationPeriodMonths).toBe(2);

      for (let i = 0; i < patterns.length - 1; i++) {
        expect(patterns[i].relevanceScore).toBeGreaterThanOrEqual(
          patterns[i + 1].relevanceScore
        );
      }
    });
  });
});