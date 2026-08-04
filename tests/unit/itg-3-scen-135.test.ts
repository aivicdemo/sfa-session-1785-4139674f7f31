import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件照合機能', () => {
  // SCEN-135
  test('過去商談から1件の成功パターンが抽出される場合の推論実行判定', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'SP-001',
          similarityScore: 0.92,
          industry: 'SaaS',
          contractAmountMin: 5000000,
          contractAmountMax: 10000000,
          contractDurationDays: 45,
          successCount: 12,
          failureCount: 1,
        },
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerId: 'CUST-12345',
      customerIndustry: 'SaaS',
      estimatedContractAmount: 7000000,
      currentDealStage: 'pre-proposal',
      dealId: 'DEAL-67890',
    };

    const result = generateRecommendation(newDealData, mockAIEngine);

    expect(result.recommendationPatternCount).toBe(1);
    expect(result.patternDetected).toBe(true);
    expect(result.usedPatternId).toEqual(['SP-001']);
    expect(result.recommendedApproach).toBeTruthy();
    expect(result.recommendedApproach.length).toBeGreaterThan(0);
    expect(result.recommendedApproach).toContain('SaaS');
    expect(result.recommendedApproach).toContain('500');
    expect(result.recommendedApproach).toContain('1000');
    expect(result.recommendedApproach).toContain('45');
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealData);
  });
});