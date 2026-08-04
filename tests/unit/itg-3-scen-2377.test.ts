import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-2377
  test('新規案件の顧客条件と商談条件が明確に定義されているとき、高い精度スコアで推論される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        evaluationScore: 0.85,
        recommendationData: {
          approach: 'Production efficiency proposal for manufacturing',
          reason: 'Matched with past successful patterns'
        }
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        applicabilityScore: 0.82
      })
    };

    const newDealData = {
      customerConditions: {
        industry: 'Manufacturing',
        companySize: 1500,
        businessChallenge: 'Production efficiency improvement'
      },
      dealConditions: {
        proposalStage: 'Initial hearing completed',
        budgetApprovalStatus: 'Approved',
        decisionMakerConfirmed: true
      }
    };

    const result = calculateInferenceAccuracyScore(
      newDealData,
      mockAIRecommendationEngine
    );

    expect(result.inferenceAccuracyScore).toBeGreaterThanOrEqual(0.83);
    expect(result.inferenceAccuracyScore).toBeLessThanOrEqual(1.0);
    expect(result.rationale).toBeDefined();
    expect(result.rationale).toContain('Manufacturing');
    expect(result.rationale).toContain('efficiency');
    expect(result.rationale).toContain('Approved');
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: 'Manufacturing',
        companySize: 1500
      })
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});