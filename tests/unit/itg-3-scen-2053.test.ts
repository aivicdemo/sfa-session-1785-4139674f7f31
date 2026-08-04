import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2053
  test('適用可能な成功パターン候補が1件のとき、その1件が推奨提案アプローチとして返却される', () => {
    const newDealData = {
      customerIndustry: '製造業',
      dealStage: '提案前',
      budgetAmount: 50000000,
      customerId: 'CUST-12345',
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PAT-001',
          patternName: '大手製造業向けDX導入提案',
          applicabilityScore: 0.95,
          successRate: 0.82,
          industryMatch: '製造業',
          budgetRangeMin: 30000000,
          budgetRangeMax: 100000000,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockImplementation((patternId) => {
        if (patternId === 'PAT-001') {
          return {
            relevanceScore: 0.95,
            matchedFactors: ['業種一致', '予算範囲内', '商談段階適合'],
          };
        }
        return { relevanceScore: 0, matchedFactors: [] };
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        '大手製造業向けDX導入提案に基づいた提案アプローチ'
      ),
    };

    const result = generateRecommendation(newDealData, mockAIRecommendationEngine);

    expect(result.recommendedPatternId).toBe('PAT-001');
    expect(result.recommendedApproach).toContain('大手製造業向けDX導入提案に基づいた提案アプローチ');
    expect(result.relevanceScore).toBe(0.95);
    expect(result.candidatePatterns).toHaveLength(1);
    expect(result.candidatePatterns[0].patternId).toBe('PAT-001');
    expect(result.candidatePatterns[0].patternName).toBe('大手製造業向けDX導入提案');
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealData);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith('PAT-001', newDealData);
  });
});