import { calculateRecommendationTrustScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨信頼度スコア算出機能', () => {
  // SCEN-790
  test('成功パターンの適用可能性スコアが入力されたとき、信頼度に反映される', () => {
    const applicabilityScore = 0.85;
    const baseScore = 0.70;
    const expectedTrustScore = baseScore * applicabilityScore;

    const input = {
      customerIndustry: 'IT',
      dealSize: '中規模',
      dealStage: '提案段階',
      successPatternId: 'PAT-001',
      applicabilityScore: applicabilityScore,
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(applicabilityScore),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const result = calculateRecommendationTrustScore(input, mockAIRecommendationEngine);

    expect(result).toBeGreaterThan(baseScore);
    expect(result).toBeLessThanOrEqual(1.0);
    expect(result).toBeCloseTo(expectedTrustScore, 5);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith({
      customerIndustry: 'IT',
      dealSize: '中規模',
      dealStage: '提案段階',
      successPatternId: 'PAT-001',
    });
  });
});