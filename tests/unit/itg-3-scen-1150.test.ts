import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し提案アプローチを推奨する機能', () => {
  // SCEN-1150
  test('類似商談が1件のとき、該当パターン1件のランク付け結果を返却する', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern-001',
          similarityScore: 0.92,
          dealConditions: {
            industry: '製造業',
            dealSize: '500万円以上',
            keyPerson: '経営層'
          },
          successOutcome: '受注',
          rankingPosition: 1
        }
      ])
    };

    const testDealConditions = {
      industry: '製造業',
      dealSize: '500万円以上',
      keyPerson: '経営層'
    };

    const result = await findSimilarPatterns(
      testDealConditions,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(testDealConditions);

    expect(result).toHaveLength(1);
    expect(result[0].patternId).toBe('pattern-001');
    expect(result[0].similarityScore).toBe(0.92);
    expect(result[0].rankingPosition).toBe(1);
    expect(result[0].successOutcome).toBe('受注');
    expect(result[0].dealConditions).toEqual({
      industry: '製造業',
      dealSize: '500万円以上',
      keyPerson: '経営層'
    });
  });
});