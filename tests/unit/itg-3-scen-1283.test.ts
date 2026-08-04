import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンマッチング機能', () => {
  // SCEN-1283
  test('成功パターンが1件マッチした場合にそのパターンが優先返却される', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'SUCCESS_PATTERN_001',
          patternName: '大企業向け段階的提案型',
          relevanceScore: 0.95,
        },
      ]),
    };

    const newProjectData = {
      customerScale: '大企業',
      industry: '製造業',
      budgetRange: '1000万円以上',
    };

    const result = await findSimilarPatterns(
      newProjectData,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newProjectData
    );
    expect(result).toHaveLength(1);
    expect(result[0].patternId).toBe('SUCCESS_PATTERN_001');
    expect(result[0].patternName).toBe('大企業向け段階的提案型');
    expect(result[0].relevanceScore).toBe(0.95);
  });
});