import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('AI推奨エンジン - 類似パターン検索ランク付け機能', () => {
  // SCEN-158
  test('類似度スコアが高い順に複数件のパターンが返却される', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'P001',
          similarity: 0.92,
          dealType: '大型案件',
          approach: 'アプローチA',
        },
        {
          patternId: 'P002',
          similarity: 0.78,
          dealType: '中堅案件',
          approach: 'アプローチB',
        },
        {
          patternId: 'P003',
          similarity: 0.65,
          dealType: '小規模案件',
          approach: 'アプローチC',
        },
      ]),
    };

    const dealCondition = {
      customerScale: '大型',
      industry: 'IT',
      challenge: 'DX推進',
    };

    const result = await findSimilarPatterns(dealCondition, mockAIEngine);

    expect(result).toHaveLength(3);
    expect(result[0].patternId).toBe('P001');
    expect(result[0].similarity).toBe(0.92);
    expect(result[1].patternId).toBe('P002');
    expect(result[1].similarity).toBe(0.78);
    expect(result[2].patternId).toBe('P003');
    expect(result[2].similarity).toBe(0.65);
  });
});