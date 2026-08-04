import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  test('SCEN-1125: 提案アプローチの生成結果が空配列のとき、推奨生成処理がエラーになる', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const newDealCondition = {
      customerIndustry: '小売業',
      dealScale: '中規模',
      budget: '500万円',
      issue: '在庫管理の効率化',
    };

    const result = await generateRecommendation(
      newDealCondition,
      mockAIRecommendationEngine
    );

    expect(result).toBeDefined();
    expect(result.isError).toBe(true);
    expect(result.errorCode).toBe('NO_SIMILAR_PATTERNS_FOUND');
    expect(result.errorMessage).toContain(
      '提案アプローチの生成に必要な類似成功パターンが見つかりませんでした'
    );
    expect(result.recommendedApproach).toBeNull();
    expect(result.reasoning).toBeUndefined();
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
  });
});