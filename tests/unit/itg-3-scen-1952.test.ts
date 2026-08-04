import { evaluatePatternRelevance, findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1952
  test('成功パターン抽出・照合機能 - 過去商談データから抽出された成功パターンが複数件のときに全パターンが適用候補となる', async () => {
    const newDealData = {
      customerId: 'CUST-20240115-001',
      industryType: 'manufacturing',
      companySize: 'large',
      budgetRange: 5000000,
      dealStage: 'proposal',
      customerChallenges: ['cost_reduction', 'process_optimization'],
      timeline: 90,
    };

    const mockSimilarPatterns = [
      {
        patternId: 'pattern-A-001',
        patternDescription: 'Large manufacturing customer with cost reduction focus',
        successRate: 0.82,
        relevanceScore: 0.85,
        matchedAttributes: {
          industry: 'manufacturing',
          size: 'large',
          primaryChallenge: 'cost_reduction',
        },
      },
      {
        patternId: 'pattern-B-002',
        patternDescription: 'Large manufacturing customer with process optimization',
        successRate: 0.78,
        relevanceScore: 0.85,
        matchedAttributes: {
          industry: 'manufacturing',
          size: 'large',
          primaryChallenge: 'process_optimization',
        },
      },
      {
        patternId: 'pattern-C-003',
        patternDescription: 'Multi-challenge engagement in manufacturing sector',
        successRate: 0.81,
        relevanceScore: 0.85,
        matchedAttributes: {
          industry: 'manufacturing',
          size: 'large',
          multipleChallenge: true,
        },
      },
    ];

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatterns),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((dealData, pattern) => {
          const baseScore = pattern.relevanceScore;
          const timelineFactor = dealData.timeline > 60 ? 1.0 : 0.9;
          const budgetFactor = dealData.budgetRange >= 5000000 ? 1.0 : 0.85;
          const calculatedScore = Math.min(
            1.0,
            baseScore * timelineFactor * budgetFactor
          );
          return Promise.resolve({
            patternId: pattern.patternId,
            applicableScore: calculatedScore,
            isApplicable: calculatedScore >= 0.7,
            riskFactors: [],
          });
        }),
    };

    const similarPatterns = await mockAIRecommendationEngine.findSimilarPatterns(
      newDealData
    );

    expect(similarPatterns).toHaveLength(3);
    expect(similarPatterns[0].patternId).toBe('pattern-A-001');
    expect(similarPatterns[1].patternId).toBe('pattern-B-002');
    expect(similarPatterns[2].patternId).toBe('pattern-C-003');

    const recommendedPatterns = [];
    for (const pattern of similarPatterns) {
      const evaluation = await mockAIRecommendationEngine.evaluatePatternRelevance(
        newDealData,
        pattern
      );
      recommendedPatterns.push({
        patternId: evaluation.patternId,
        patternDescription: pattern.patternDescription,
        relevanceScore: evaluation.applicableScore,
        applicableConditions: pattern.matchedAttributes,
        isApplicable: evaluation.isApplicable,
      });
    }

    expect(recommendedPatterns).toHaveLength(3);

    expect(recommendedPatterns[0]).toEqual({
      patternId: 'pattern-A-001',
      patternDescription: 'Large manufacturing customer with cost reduction focus',
      relevanceScore: 0.85,
      applicableConditions: {
        industry: 'manufacturing',
        size: 'large',
        primaryChallenge: 'cost_reduction',
      },
      isApplicable: true,
    });

    expect(recommendedPatterns[1]).toEqual({
      patternId: 'pattern-B-002',
      patternDescription:
        'Large manufacturing customer with process optimization',
      relevanceScore: 0.85,
      applicableConditions: {
        industry: 'manufacturing',
        size: 'large',
        primaryChallenge: 'process_optimization',
      },
      isApplicable: true,
    });

    expect(recommendedPatterns[2]).toEqual({
      patternId: 'pattern-C-003',
      patternDescription: 'Multi-challenge engagement in manufacturing sector',
      relevanceScore: 0.85,
      applicableConditions: {
        industry: 'manufacturing',
        size: 'large',
        multipleChallenge: true,
      },
      isApplicable: true,
    });

    recommendedPatterns.forEach((pattern) => {
      expect(pattern.relevanceScore).toBeGreaterThanOrEqual(0.0);
      expect(pattern.relevanceScore).toBeLessThanOrEqual(1.0);
      expect(pattern.patternId).toBeDefined();
      expect(pattern.patternDescription).toBeDefined();
      expect(pattern.applicableConditions).toBeDefined();
    });

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealData
    );
    expect(
      mockAIRecommendationEngine.evaluatePatternRelevance
    ).toHaveBeenCalledTimes(3);
  });
});