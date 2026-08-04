import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1890
  test('evaluatePatternRelevance が 100 を超えるスコアを返すとき推奨生成に失敗する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(100.5),
    };

    const newDealInput = {
      customerIndustry: 'SaaS',
      budgetAmount: 5000000,
      decisionMakersCount: 3,
    };

    const pastSuccessPatterns = [
      {
        patternId: 'pattern_001',
        industry: 'SaaS',
        budgetRange: { min: 3000000, max: 7000000 },
        decisionMakersRange: { min: 2, max: 5 },
        successRate: 0.85,
      },
    ];

    expect(() => {
      generateRecommendation(
        newDealInput,
        pastSuccessPatterns,
        mockAIRecommendationEngine
      );
    }).toThrow(/PatternRelevanceScoreOutOfRangeError/);
  });
});