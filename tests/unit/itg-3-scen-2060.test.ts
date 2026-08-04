import { extractSuccessPatternsAndRecommendApproach } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2060
  test('成功パターン候補のランク付けスコアが逆順になっているとき、昇順ソートにより正しい順序に修正される', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        { patternId: 'P3', relevanceScore: 0.72 },
        { patternId: 'P2', relevanceScore: 0.87 },
        { patternId: 'P1', relevanceScore: 0.95 }
      ])
    };

    const newDealCondition = {
      industry: 'IT',
      budgetSize: '5000000',
      decisionMakerCount: 3
    };

    const result = extractSuccessPatternsAndRecommendApproach(
      newDealCondition,
      mockAIEngine
    );

    expect(result.successPatterns).toEqual([
      { patternId: 'P1', relevanceScore: 0.95 },
      { patternId: 'P2', relevanceScore: 0.87 },
      { patternId: 'P3', relevanceScore: 0.72 }
    ]);
    expect(result.successPatterns[0].relevanceScore).toBe(0.95);
    expect(result.successPatterns[1].relevanceScore).toBe(0.87);
    expect(result.successPatterns[2].relevanceScore).toBe(0.72);
    expect(result.successPatterns[0].patternId).toBe('P1');
    expect(result.successPatterns[1].patternId).toBe('P2');
    expect(result.successPatterns[2].patternId).toBe('P3');
  });
});