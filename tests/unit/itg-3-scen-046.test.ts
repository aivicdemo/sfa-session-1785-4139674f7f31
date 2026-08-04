import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-046
  test('[normal] 類似パターン検索機能 - 類似パターンが0件の場合に空の結果が正常に返される', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const dealCondition = {
      customerIndustry: '小売',
      dealStage: '提案段階',
      budgetSize: 5000000,
    };

    const result = findSimilarPatterns(dealCondition, mockAIRecommendationEngine);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      dealCondition
    );

    expect(result).toEqual({
      patterns: [],
      totalCount: 0,
      searchCompleted: true,
    });
  });
});