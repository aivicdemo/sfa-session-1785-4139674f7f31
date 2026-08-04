import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  test('SCEN-1953: 顧客条件が欠落しているときパターン照合がスキップされる', () => {
    const mockAiEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDeal = {
      dealId: 'DEAL-2025-001',
      customerName: 'ABC Corporation',
      industry: 'Manufacturing',
      budgetAmount: 5000000,
      customerChallenge: null,
      customerNeeds: null,
    };

    const result = generateRecommendation(newDeal, mockAiEngine);

    expect(mockAiEngine.findSimilarPatterns).not.toHaveBeenCalled();

    expect(result.patternId).toMatch(/^PAT-/);
    expect(result.recommendedApproach).toBeDefined();
    expect(typeof result.recommendedApproach).toBe('string');
    expect(result.recommendedApproach.length).toBeGreaterThan(0);

    expect(result.reasoningDetail.flag).toBe('SIMPLIFIED');
    expect(result.reasoningDetail.detail).toBeDefined();
    expect(typeof result.reasoningDetail.detail).toBe('string');

    expect(result.errors).toEqual([]);
  });
});