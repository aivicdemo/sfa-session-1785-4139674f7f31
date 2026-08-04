import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・マッチング機能', () => {
  // SCEN-262
  test('過去商談データから成功パターンが1件のとき、そのパターンが推奨対象として評価される', () => {
    const successPattern = {
      patternId: 'SP001',
      industry: '大規模製造業',
      budgetMin: 50000000,
      decisionMaker: '経営層',
      proposalDurationMonths: 3,
      successRate: 0.92,
    };

    const mockFindSimilarPatterns = jest.fn().mockReturnValue([
      {
        patternId: successPattern.patternId,
        industry: successPattern.industry,
        budgetMin: successPattern.budgetMin,
        decisionMaker: successPattern.decisionMaker,
        proposalDurationMonths: successPattern.proposalDurationMonths,
        successRate: successPattern.successRate,
      },
    ]);

    const mockEvaluatePatternRelevance = jest.fn().mockReturnValue({
      patternId: successPattern.patternId,
      relevanceScore: 0.85,
      isRecommendationTarget: true,
    });

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
      explainRecommendationReasoning: jest.fn(),
    };

    const newDealData = {
      customerId: 'CUST-NEW-001',
      customerIndustry: '大規模製造業',
      budgetAmount: 60000000,
      decisionMaker: 'CTO',
      proposalDurationMonths: 2,
      customerSize: 'large',
    };

    const result = generateRecommendation(newDealData, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.recommendedPatternCount).toBe(1);
    expect(result.patterns).toHaveLength(1);
    expect(result.patterns[0].relevanceScore).toBeGreaterThanOrEqual(0.85);
    expect(result.patterns[0].isRecommendationTarget).toBe(true);
    expect(result.recommendationReason).toMatch(/過去成功事例との類似度が高い/);
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(newDealData);
    expect(mockEvaluatePatternRelevance).toHaveBeenCalled();
  });
});