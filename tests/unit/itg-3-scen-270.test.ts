import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・マッチング機能', () => {
  // SCEN-270
  test('過去商談データが同一の類似度スコアで複数並んでいるとき、すべてが同等の推奨候補として扱われる', async () => {
    const mockEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'P001',
          score: 0.85,
          description: '大規模SaaS案件への提案',
          rank: 1,
        },
        {
          patternId: 'P002',
          score: 0.85,
          description: 'エンタープライズ顧客向けカスタマイズ',
          rank: 1,
        },
        {
          patternId: 'P003',
          score: 0.85,
          description: '複数部門への段階的導入',
          rank: 1,
        },
      ]),
    };

    const newCaseCondition = {
      customerScale: '大企業',
      industry: '情報通信',
      budgetRange: '10M円以上',
    };

    const result = await findSimilarPatterns(newCaseCondition, mockEngine);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      patternId: 'P001',
      score: 0.85,
      description: '大規模SaaS案件への提案',
      rank: 1,
    });
    expect(result[1]).toEqual({
      patternId: 'P002',
      score: 0.85,
      description: 'エンタープライズ顧客向けカスタマイズ',
      rank: 1,
    });
    expect(result[2]).toEqual({
      patternId: 'P003',
      score: 0.85,
      description: '複数部門への段階的導入',
      rank: 1,
    });

    const allScores = result.map((p) => p.score);
    expect(allScores).toEqual([0.85, 0.85, 0.85]);

    const allRanks = result.map((p) => p.rank);
    expect(allRanks).toEqual([1, 1, 1]);

    const sortedByScore = result.sort((a, b) => b.score - a.score);
    expect(sortedByScore.slice(0, 3).every((p) => p.score === 0.85)).toBe(true);
  });
});