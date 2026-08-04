import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案妥当性判定', () => {
  test('SCEN-1194: 顧客ニーズ適合スコアがちょうど閾値の場合に適合と判定される', () => {
    const thresholdScore = 0.75;
    const customerNeedsData = {
      industry: '製造業',
      budgetSize: '大規模',
      challengeContent: 'デジタル化推進',
      companyScale: 100,
      contactFrequency: 5,
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: thresholdScore,
        applicablePatterns: ['pattern_A', 'pattern_B'],
        confidence: 0.85,
      }),
    };

    const result = evaluatePatternRelevance(
      customerNeedsData,
      thresholdScore,
      mockAIRecommendationEngine
    );

    expect(result.judgmentStatus).toBe('適合');
    expect(result.isCompatible).toBe(true);
    expect(result.applicabilityDetermination).toBe('YES');
    expect(result.relevanceScore).toBe(0.75);
    expect(result.recommendedProposals).toEqual(['pattern_A', 'pattern_B']);
    expect(result.confidenceScore).toBe(0.85);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      customerNeedsData,
      thresholdScore
    );
  });
});