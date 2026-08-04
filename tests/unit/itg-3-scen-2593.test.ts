import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンテンプレート自動判定機能', () => {
  test('SCEN-2593: 顧客属性が完全に設定されている場合、正確に成功パターンと照合される', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-MFG-001',
          industry: '製造業',
          companySize: '大企業',
          challenge: 'デジタル化',
          relevanceScore: 0.95,
          dealDetails: {
            caseId: 'CASE-2024-001',
            dealConditions: {
              industry: '製造業',
              companySize: '大企業',
              budget: '5000万円以上',
              decisionMakersCount: 5,
            },
            contractAmount: 50000000,
            salesDurationDays: 90,
          },
        },
        {
          patternId: 'PAT-MFG-002',
          industry: '製造業',
          companySize: '大企業',
          challenge: 'デジタル化',
          relevanceScore: 0.88,
          dealDetails: {
            caseId: 'CASE-2024-002',
            dealConditions: {
              industry: '製造業',
              companySize: '大企業',
              budget: '5000万円以上',
              decisionMakersCount: 5,
            },
            contractAmount: 45000000,
            salesDurationDays: 75,
          },
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        applicable: true,
        score: 0.95,
      }),
    };

    const inputCaseData = {
      industry: '製造業',
      companySize: '大企業',
      challenge: 'デジタル化',
      budget: 5000,
      decisionMakersCount: 5,
    };

    const expectedHighestScorePattern = {
      patternId: 'PAT-MFG-001',
      relevanceScore: 0.95,
      dealDetails: {
        caseId: 'CASE-2024-001',
        contractAmount: 50000000,
        salesDurationDays: 90,
      },
    };

    const result = evaluatePatternRelevance(
      inputCaseData,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      inputCaseData
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(result.patterns).toBeDefined();
    expect(result.patterns.length).toBeGreaterThan(0);
    expect(result.patterns[0].patternId).toBe(expectedHighestScorePattern.patternId);
    expect(result.patterns[0].relevanceScore).toBe(
      expectedHighestScorePattern.relevanceScore
    );
    expect(result.patterns[0].dealDetails.caseId).toBe(
      expectedHighestScorePattern.dealDetails.caseId
    );
    expect(result.patterns[0].dealDetails.contractAmount).toBe(
      expectedHighestScorePattern.dealDetails.contractAmount
    );
    expect(result.patterns[0].dealDetails.salesDurationDays).toBe(
      expectedHighestScorePattern.dealDetails.salesDurationDays
    );
    expect(result.patterns[0].relevanceScore).toBeGreaterThanOrEqual(0.92);
    expect(result.patterns[0].dealDetails).toHaveProperty('caseId');
    expect(result.patterns[0].dealDetails).toHaveProperty('contractAmount');
    expect(result.patterns[0].dealDetails).toHaveProperty('salesDurationDays');
  });
});