import { findSimilarPatterns, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨機能', () => {
  // SCEN-677
  test('関連度スコアが閾値に達する場合、適用可能なパターンとして判定される', async () => {
    const newDealData = {
      customerIndustry: '製造業',
      dealAmount: 5000000,
      decisionMakerCount: 3,
    };

    const relevanceThreshold = 0.75;

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.75),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PATTERN-042',
          relevanceScore: 0.75,
          successRate: 0.82,
          customerIndustry: '製造業',
          dealAmountRange: { min: 3000000, max: 7000000 },
          decisionMakerCountRange: { min: 2, max: 5 },
        },
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const result = await findSimilarPatterns(newDealData, mockAIEngine, relevanceThreshold);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      patternId: 'PATTERN-042',
      relevanceScore: 0.75,
      status: 'applicable',
    });
    expect(result[0].relevanceScore).toBe(0.75);
    expect(result[0].relevanceScore >= relevanceThreshold).toBe(true);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealData);
  });
});