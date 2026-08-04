import { verifyRecommendationConsistency } from '../../src/logic/it-1-br-3-1-1-1';

interface AIRecommendationEngineStub {
  generateRecommendation: jest.Mock;
  findSimilarPatterns: jest.Mock;
  explainRecommendationReasoning: jest.Mock;
  evaluatePatternRelevance: jest.Mock;
}

describe('推奨精度検証機能', () => {
  // SCEN-377
  test('同一の推奨精度検証入力で2回実行したとき、同一の検証結果が返却される', () => {
    const mockRecommendationEngine: AIRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const verificationInput = {
      industry: 'IT',
      dealAmount: 5000000,
      proposalPeriodDays: 30,
      customerScale: 'large',
      productCategory: 'cloud_solution',
      salesPersonExperience: 'mid_level',
    };

    const mockGeneratedRecommendation = {
      recommendationScore: 78,
      patternId: 'PAT-2024-001',
      recommendedApproach: 'multi_touch_engagement',
    };

    const mockSimilarPatterns = [
      {
        patternId: 'HIST-2023-045',
        similarityScore: 0.92,
        industryMatch: 'IT',
        dealAmountRange: '4000000-6000000',
        successRate: 0.85,
      },
      {
        patternId: 'HIST-2023-078',
        similarityScore: 0.88,
        industryMatch: 'IT',
        dealAmountRange: '3000000-7000000',
        successRate: 0.82,
      },
    ];

    const mockReasoningExplanation =
      '顧客の業種（IT）と商談金額（500万円）が過去の成功事例と一致し、提案期間30日は標準的なサイクルです。営業担当者の経験レベル（中程度）では多段階接触が効果的です。';

    const mockRelevanceScore = {
      applicabilityScore: 0.87,
      riskFactors: ['market_volatility', 'budget_constraint'],
      confidenceLevel: 'high',
    };

    mockRecommendationEngine.generateRecommendation.mockReturnValue(
      mockGeneratedRecommendation
    );
    mockRecommendationEngine.findSimilarPatterns.mockReturnValue(mockSimilarPatterns);
    mockRecommendationEngine.explainRecommendationReasoning.mockReturnValue(
      mockReasoningExplanation
    );
    mockRecommendationEngine.evaluatePatternRelevance.mockReturnValue(
      mockRelevanceScore
    );

    const firstVerificationResult = verifyRecommendationConsistency(
      verificationInput,
      mockRecommendationEngine
    );

    const secondVerificationResult = verifyRecommendationConsistency(
      verificationInput,
      mockRecommendationEngine
    );

    expect(firstVerificationResult.recommendationScore).toBe(78);
    expect(secondVerificationResult.recommendationScore).toBe(78);

    expect(firstVerificationResult.patternId).toBe('PAT-2024-001');
    expect(secondVerificationResult.patternId).toBe('PAT-2024-001');

    expect(firstVerificationResult.reasoningExplanation).toBe(mockReasoningExplanation);
    expect(secondVerificationResult.reasoningExplanation).toBe(mockReasoningExplanation);

    expect(firstVerificationResult.applicabilityScore).toBe(0.87);
    expect(secondVerificationResult.applicabilityScore).toBe(0.87);

    expect(firstVerificationResult.similarPatternsOrder).toEqual([
      'HIST-2023-045',
      'HIST-2023-078',
    ]);
    expect(secondVerificationResult.similarPatternsOrder).toEqual([
      'HIST-2023-045',
      'HIST-2023-078',
    ]);

    expect(firstVerificationResult).toEqual(secondVerificationResult);
  });
});