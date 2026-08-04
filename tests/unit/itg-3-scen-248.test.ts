import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似成功パターン検索機能', () => {
  test('SCEN-248: ランキングスコアが許容値を超過したときエラーをスロー', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        patterns: [
          {
            patternId: 'pattern_001',
            customerIndustry: 'IT',
            budgetRange: '1000万円以上',
            rankingScore: 1.15,
            successRate: 0.92,
            description: 'IT業界大規模案件の成功パターン'
          }
        ],
        totalMatches: 1
      })
    };

    const dealCondition = {
      industry: 'IT',
      budgetScale: '1000万円以上',
      dealStage: '提案段階'
    };

    await expect(
      findSimilarPatterns(dealCondition, mockAIRecommendationEngine)
    ).rejects.toThrow(/ランキングスコア/);
  });
});