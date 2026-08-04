import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1422
  test('過去商談データが1件のとき、AI推奨エンジンが正常に推奨を生成する', async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'コスト削減提案',
        reasoningExplanation: '顧客業種が一致し、予算規模が類似しているため、過去の成功パターンを適用可能です',
        similarPatternInfo: {
          pastDealId: 'deal_001',
          pastCustomerIndustry: '製造業',
          pastDealAmount: 5000000,
          pastApproach: 'コスト削減提案',
          pastResult: '成功',
        },
        applicabilityScore: 0.87,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_001',
          dealId: 'deal_001',
          customerIndustry: '製造業',
          dealAmount: 5000000,
          approach: 'コスト削減提案',
          result: '成功',
          similarityScore: 0.87,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.87,
        isApplicable: true,
      }),
    };

    const newDealInput = {
      customerIndustry: '製造業',
      budgetRangeMin: 4000000,
      budgetRangeMax: 6000000,
      challenge: '生産効率化',
      salesPerson: 'sales_001',
    };

    const result = await generateRecommendation(
      newDealInput,
      mockRecommendationEngine
    );

    expect(result.recommendedApproach).toBe('コスト削減提案');
    expect(result.reasoningExplanation).toContain('顧客業種が一致');
    expect(result.reasoningExplanation).toContain('予算規模が類似');
    expect(result.similarPatternInfo).toEqual({
      pastDealId: 'deal_001',
      pastCustomerIndustry: '製造業',
      pastDealAmount: 5000000,
      pastApproach: 'コスト削減提案',
      pastResult: '成功',
    });
    expect(result.applicabilityScore).toBe(0.87);
    expect(typeof result.applicabilityScore).toBe('number');
    expect(result.applicabilityScore).toBeGreaterThanOrEqual(0);
    expect(result.applicabilityScore).toBeLessThanOrEqual(1);

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockRecommendationEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(mockRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerIndustry: '製造業',
        challenge: '生産効率化',
      })
    );
  });
});