import { aggregateRecommendationPatternFrequency } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターンマスタの統計集計機能', () => {
  // SCEN-319
  test('同じパターンが重複して存在するとき、重複を含めて出現頻度がカウントされる', () => {
    const patternId = 'P001';
    const patternContent = '顧客規模:大企業、業界:製造、提案タイプ:コスト削減';

    const recommendationPatterns = [
      {
        patternId: patternId,
        patternContent: patternContent,
        frequency: 0,
      },
      {
        patternId: patternId,
        patternContent: patternContent,
        frequency: 0,
      },
      {
        patternId: patternId,
        patternContent: patternContent,
        frequency: 0,
      },
      {
        patternId: patternId,
        patternContent: patternContent,
        frequency: 0,
      },
    ];

    const result = aggregateRecommendationPatternFrequency(
      recommendationPatterns
    );

    const aggregatedPattern = result.find((p) => p.patternId === patternId);

    expect(aggregatedPattern).toBeDefined();
    expect(aggregatedPattern?.frequency).toBe(4);
  });
});