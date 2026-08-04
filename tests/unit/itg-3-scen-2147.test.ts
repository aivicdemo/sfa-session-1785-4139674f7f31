import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIRecommendationEngine - findSimilarPatterns Error Handling', () => {
  // SCEN-2147
  test('should throw error when findSimilarPatterns returns null', async () => {
    const mockEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(null),
    };

    const dealConditions = {
      industry: '製造業',
      budgetScale: '500万円以上',
      decisionPeriod: '3ヶ月以内',
    };

    await expect(
      findSimilarPatterns(mockEngine, dealConditions)
    ).rejects.toThrow(/null|null参照|検索結果/);

    expect(mockEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(mockEngine.findSimilarPatterns).toHaveBeenCalledWith(dealConditions);
  });
});