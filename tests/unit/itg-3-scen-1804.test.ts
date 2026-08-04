import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能', () => {
  // SCEN-1804
  test('推奨アプローチが高い関連度順に返却される', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_a',
          relevanceScore: 0.95,
          patternName: 'パターンA',
          reasoning: 'コスト削減を重視する製造業向けの標準アプローチ'
        },
        {
          patternId: 'pattern_b',
          relevanceScore: 0.78,
          patternName: 'パターンB',
          reasoning: '中規模企業向けの段階的導入アプローチ'
        },
        {
          patternId: 'pattern_c',
          relevanceScore: 0.62,
          patternName: 'パターンC',
          reasoning: 'リスク分散型の複合提案アプローチ'
        }
      ])
    };

    const newDealData = {
      customerIndustry: '製造業',
      challenge: 'コスト削減',
      budgetScale: 5000000
    };

    const result = await findSimilarPatterns(newDealData, mockAIRecommendationEngine);

    expect(result).toHaveLength(3);
    expect(result[0].relevanceScore).toBe(0.95);
    expect(result[1].relevanceScore).toBe(0.78);
    expect(result[2].relevanceScore).toBe(0.62);
    expect(result[0].patternName).toBe('パターンA');
    expect(result[1].patternName).toBe('パターンB');
    expect(result[2].patternName).toBe('パターンC');
    expect(result[0].reasoning).toBe('コスト削減を重視する製造業向けの標準アプローチ');
    expect(result[1].reasoning).toBe('中規模企業向けの段階的導入アプローチ');
    expect(result[2].reasoning).toBe('リスク分散型の複合提案アプローチ');
  });
});