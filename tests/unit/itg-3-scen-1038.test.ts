import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチの推奨判定', () => {
  // SCEN-1038
  test('[edge] 提案アプローチの順序が逆順の場合、正しい優先度順に再ソートされる', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([
        { id: 'approach-3', score: 30 },
        { id: 'approach-1', score: 60 },
        { id: 'approach-2', score: 90 },
      ]),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputData = {
      customerIndustry: '製造業',
      challenge: 'DX推進',
      budgetRange: '1000万円以上',
    };

    const result = await generateRecommendation(inputData, mockAIEngine);

    expect(result).toEqual([
      { id: 'approach-2', score: 90 },
      { id: 'approach-1', score: 60 },
      { id: 'approach-3', score: 30 },
    ]);
  });
});