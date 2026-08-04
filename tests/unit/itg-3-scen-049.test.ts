import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-049: 類似パターン検索機能 - 商談条件が未設定の場合に検索が正常に実行される', () => {
    const emptyDealCondition = {};

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pat_001',
          successRankScore: 85,
          description: 'Tech startup with high growth potential',
          industryType: 'IT',
          dealStage: 'initial_contact',
        },
        {
          patternId: 'pat_002',
          successRankScore: 72,
          description: 'Manufacturing company with budget constraints',
          industryType: 'Manufacturing',
          dealStage: 'proposal',
        },
        {
          patternId: 'pat_003',
          successRankScore: 68,
          description: 'Service industry with long sales cycle',
          industryType: 'Service',
          dealStage: 'negotiation',
        },
      ]),
    };

    return findSimilarPatterns(emptyDealCondition, mockAIRecommendationEngine).then((result) => {
      expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(emptyDealCondition);
      expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(1);

      result.forEach((pattern: any) => {
        expect(typeof pattern.successRankScore).toBe('number');
        expect(pattern.successRankScore).toBeGreaterThanOrEqual(0);
        expect(pattern.successRankScore).toBeLessThanOrEqual(100);
        expect(pattern.patternId).toBeDefined();
      });

      expect(result[0].successRankScore).toBe(85);
      expect(result[1].successRankScore).toBe(72);
      expect(result[2].successRankScore).toBe(68);

      const systemError = result.error;
      expect(systemError).toBeNull();
      expect(systemError).toBeUndefined();
    });
  });
});