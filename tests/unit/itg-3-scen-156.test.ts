import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-156
  test('[edge] 類似パターン検索ランク付け機能 - 類似度スコアが高い順に0件のパターンが返却される', () => {
    const dealCondition = {
      industry: 'IT',
      budgetScale: '5000万円',
      decisionPeriod: '3ヶ月以内',
    };

    const mockFindSimilarPatterns = jest.fn().mockReturnValue([]);
    const mockAIRecommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
    };

    const result = findSimilarPatterns(dealCondition, mockAIRecommendationEngine);

    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(dealCondition);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});