import { rankRecommendationPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターンランク付け機能', () => {
  // SCEN-2352
  test('適用可能な成功パターンが0件のときランク付けされたリストが空配列で返却される', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const dealCondition = {
      customerIndustry: 'IT',
      dealAmount: 5000000,
      decisionMakerCount: 3,
    };

    const result = rankRecommendationPatterns(
      dealCondition,
      mockAIRecommendationEngine
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});