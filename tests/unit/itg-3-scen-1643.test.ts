import { calculateRecommendationRelevanceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1643
  test('[normal] 推奨妥当性スコア算出機能 - AIエージェント推奨エンジンが正常応答する場合、外部AI結果に基づくスコアが算出される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        patternId: 'PAT-001',
        relevanceScore: 0.87,
        confidence: 0.92,
        applicabilityFactors: ['業界一致', '予算規模一致', '導入期間一致'],
      }),
    };

    const newProjectCondition = {
      customerIndustry: '製造業',
      budgetAmount: 5000000,
      implementationPeriod: 3,
    };

    const result = calculateRecommendationRelevanceScore(
      newProjectCondition,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newProjectCondition
    );

    expect(result).toEqual({
      patternId: 'PAT-001',
      relevanceScore: 0.87,
      confidence: 0.92,
      applicabilityFactors: ['業界一致', '予算規模一致', '導入期間一致'],
    });

    expect(result.relevanceScore).toBe(0.87);
    expect(result.confidence).toBe(0.92);
    expect(result.applicabilityFactors).toEqual([
      '業界一致',
      '予算規模一致',
      '導入期間一致',
    ]);
  });
});