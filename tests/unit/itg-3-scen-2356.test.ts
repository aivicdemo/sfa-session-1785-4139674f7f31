import { rankRecommendationPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターンランク付け機能', () => {
  test('SCEN-2356: 複数の成功パターンが同一スコアのとき全て同じランクで返却される', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_a',
          patternName: 'パターンA',
          score: 0.85,
          description: 'テスト用パターンA',
        },
        {
          patternId: 'pattern_b',
          patternName: 'パターンB',
          score: 0.85,
          description: 'テスト用パターンB',
        },
        {
          patternId: 'pattern_c',
          patternName: 'パターンC',
          score: 0.85,
          description: 'テスト用パターンC',
        },
      ]),
    };

    const dealConditions = {
      customerIndustry: '製造業',
      dealAmount: 5000000,
      decisionMakerCount: 3,
    };

    const result = rankRecommendationPatterns(dealConditions, mockAIEngine);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          patternId: 'pattern_a',
          patternName: 'パターンA',
          score: 0.85,
          rankNumber: 1,
        }),
        expect.objectContaining({
          patternId: 'pattern_b',
          patternName: 'パターンB',
          score: 0.85,
          rankNumber: 1,
        }),
        expect.objectContaining({
          patternId: 'pattern_c',
          patternName: 'パターンC',
          score: 0.85,
          rankNumber: 1,
        }),
      ])
    );

    expect(result).toHaveLength(3);
    expect(result.every((pattern) => pattern.rankNumber === 1)).toBe(true);
    expect(result.every((pattern) => pattern.score === 0.85)).toBe(true);
  });
});