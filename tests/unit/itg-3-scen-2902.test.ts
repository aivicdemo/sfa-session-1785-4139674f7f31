import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 成功パターン照合ランキング', () => {
  // SCEN-2902
  test('適用スコアが同値である複数の成功パターンが存在するときに順序が一定に保たれる', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((patternId: string): number => {
        const scoreMap: Record<string, number> = {
          'pattern_A': 0.85,
          'pattern_B': 0.85,
          'pattern_C': 0.85,
        };
        return scoreMap[patternId] ?? 0;
      }),
    };

    const newDealCondition = {
      industry: 'IT',
      budgetAmount: 5000000,
      decisionPeriodDays: 60,
    };

    const successPatterns = [
      { id: 'pattern_A', name: 'パターンA', description: '大規模IT導入' },
      { id: 'pattern_B', name: 'パターンB', description: 'クラウド移行' },
      { id: 'pattern_C', name: 'パターンC', description: 'デジタル変革' },
    ];

    const firstRunResult = findSimilarPatterns(
      newDealCondition,
      successPatterns,
      mockAIEngine
    );

    const firstRunOrder = firstRunResult.map((pattern) => pattern.id);

    const secondRunResult = findSimilarPatterns(
      newDealCondition,
      successPatterns,
      mockAIEngine
    );

    const secondRunOrder = secondRunResult.map((pattern) => pattern.id);

    const thirdRunResult = findSimilarPatterns(
      newDealCondition,
      successPatterns,
      mockAIEngine
    );

    const thirdRunOrder = thirdRunResult.map((pattern) => pattern.id);

    expect(firstRunOrder).toEqual(firstRunOrder);
    expect(secondRunOrder).toEqual(firstRunOrder);
    expect(thirdRunOrder).toEqual(firstRunOrder);

    expect(firstRunResult[0].relevanceScore).toBe(0.85);
    expect(firstRunResult[1].relevanceScore).toBe(0.85);
    expect(firstRunResult[2].relevanceScore).toBe(0.85);
  });
});