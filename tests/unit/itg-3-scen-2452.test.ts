import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2452
  test('推奨精度スコア算出機能 - 提案内容の適合性判定スコアが0.5のときスコア計算に中間値として反映される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.5),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'pattern_001',
          similarityScore: 0.8,
          successRate: 0.75,
        },
      ]),
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: 'rec_001',
        proposalApproach: '業務効率化ソリューション',
        confidenceScore: 0,
      }),
    };

    const customerInfo = {
      industry: 'manufacturing',
      scale: 'mid_market',
      region: 'JP',
    };

    const dealConditions = {
      proposalContent: '業務効率化ソリューション',
      budgetMin: 5000000,
      budgetMax: 10000000,
      decisionProcess: 'multiple_approvers',
    };

    const relevanceScore = mockAIEngine.evaluatePatternRelevance(
      customerInfo,
      dealConditions
    );

    const similarPatterns = mockAIEngine.findSimilarPatterns(customerInfo);
    const similarityScore = similarPatterns[0].similarityScore;
    const customerFitScore = 0.6;

    const calculatedScore =
      (similarityScore + relevanceScore + customerFitScore) / 3;

    expect(relevanceScore).toBe(0.5);
    expect(calculatedScore).toBeGreaterThanOrEqual(0.3);
    expect(calculatedScore).toBeLessThanOrEqual(0.9);
    expect(calculatedScore).toBeCloseTo(
      (0.8 + 0.5 + 0.6) / 3,
      5
    );

    const result = evaluateRecommendationRelevance(
      customerInfo,
      dealConditions,
      mockAIEngine
    );

    expect(result).toHaveProperty('recommendationScore');
    expect(result.recommendationScore).toBeCloseTo(0.633, 3);
    expect(result).toHaveProperty('intermediateValues');
    expect(result.intermediateValues).toContain(0.5);
  });
});