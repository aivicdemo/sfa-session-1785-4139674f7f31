import { extractAndStructureSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2538
  test('各ステップに紐づく成功要因がちょうど閾値のとき、含まれる', () => {
    const RELEVANCE_THRESHOLD = 0.75;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn((pattern) => {
        return RELEVANCE_THRESHOLD;
      }),
    };

    const successFactorsData = [
      {
        stepId: 'step_001',
        factorName: 'Customer_Needs_Analysis',
        relevanceScore: 0.75,
        reasoning: 'Directly addresses customer needs alignment',
      },
      {
        stepId: 'step_002',
        factorName: 'Proposal_Customization',
        relevanceScore: 0.75,
        reasoning: 'Tailored proposal increases adoption likelihood',
      },
      {
        stepId: 'step_003',
        factorName: 'Executive_Engagement',
        relevanceScore: 0.75,
        reasoning: 'Executive involvement ensures decision-making support',
      },
      {
        stepId: 'step_004',
        factorName: 'Risk_Mitigation',
        relevanceScore: 0.74,
        reasoning: 'Below threshold risk handling approach',
      },
    ];

    const result = extractAndStructureSuccessPatterns(
      successFactorsData,
      mockAIRecommendationEngine,
      RELEVANCE_THRESHOLD
    );

    expect(result.successFactors).toHaveLength(3);
    expect(result.successFactors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          stepId: 'step_001',
          factorName: 'Customer_Needs_Analysis',
          relevanceScore: 0.75,
          reasoning: 'Directly addresses customer needs alignment',
        }),
        expect.objectContaining({
          stepId: 'step_002',
          factorName: 'Proposal_Customization',
          relevanceScore: 0.75,
          reasoning: 'Tailored proposal increases adoption likelihood',
        }),
        expect.objectContaining({
          stepId: 'step_003',
          factorName: 'Executive_Engagement',
          relevanceScore: 0.75,
          reasoning: 'Executive involvement ensures decision-making support',
        }),
      ])
    );

    const belowThresholdExists = result.successFactors.some(
      (factor) => factor.relevanceScore < RELEVANCE_THRESHOLD
    );
    expect(belowThresholdExists).toBe(false);
  });
});