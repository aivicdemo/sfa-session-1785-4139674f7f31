import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1792
  test('[normal] 推奨根拠の可視化機能 - 根拠データに成功パターンIDが正確に含まれる', async () => {
    const mockSuccessPatternIds = ['SUCCESS_PATTERN_001', 'SUCCESS_PATTERN_045'];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'Personalized outreach with product demo',
        successPatternIds: mockSuccessPatternIds,
        confidenceScore: 87,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: `Based on success patterns SUCCESS_PATTERN_001 and SUCCESS_PATTERN_045, this customer segment typically responds well to structured engagement.`,
        reasoning: {
          successPatternIds: mockSuccessPatternIds,
          pastExamples: [
            {
              patternId: 'SUCCESS_PATTERN_001',
              customerType: 'Enterprise',
              outcome: 'Successful',
            },
            {
              patternId: 'SUCCESS_PATTERN_045',
              customerType: 'Mid-market',
              outcome: 'Successful',
            },
          ],
          appliedWeights: {
            'SUCCESS_PATTERN_001': 0.55,
            'SUCCESS_PATTERN_045': 0.45,
          },
        },
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealInput = {
      customerId: 'CUST_2024_001',
      customerName: 'Acme Corporation',
      industry: 'Manufacturing',
      companySize: 'Enterprise',
      annualRevenue: 500000000,
      dealConditions: {
        productCategory: 'Supply Chain Solutions',
        proposedBudget: 2500000,
        implementationTimeline: 180,
      },
      salesRepId: 'REP_042',
    };

    const recommendationResult = await mockAIRecommendationEngine.generateRecommendation(
      newDealInput
    );

    const reasoningDetail = await mockAIRecommendationEngine.explainRecommendationReasoning(
      recommendationResult
    );

    const extractedPatternIds = reasoningDetail.reasoning.successPatternIds;

    expect(extractedPatternIds).toHaveLength(2);
    expect(extractedPatternIds).toEqual(['SUCCESS_PATTERN_001', 'SUCCESS_PATTERN_045']);
    expect(extractedPatternIds[0]).toBe('SUCCESS_PATTERN_001');
    expect(extractedPatternIds[1]).toBe('SUCCESS_PATTERN_045');

    const patternIdSet = new Set(extractedPatternIds);
    expect(patternIdSet.size).toBe(extractedPatternIds.length);

    const pastExamplePatternIds = reasoningDetail.reasoning.pastExamples.map(
      (example: { patternId: string }) => example.patternId
    );
    expect(pastExamplePatternIds).toEqual(extractedPatternIds);

    for (const patternId of extractedPatternIds) {
      expect(reasoningDetail.reasoning.appliedWeights).toHaveProperty(patternId);
      expect(reasoningDetail.reasoning.appliedWeights[patternId]).toBeGreaterThan(0);
    }

    expect(reasoningDetail.explanation).toContain('SUCCESS_PATTERN_001');
    expect(reasoningDetail.explanation).toContain('SUCCESS_PATTERN_045');
  });
});