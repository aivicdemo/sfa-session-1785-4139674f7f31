import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1959
  test('[edge] 成功パターン抽出・照合機能 - 過去成功事例の成約までの日数が0日のときにパターンが適用される', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'pattern-001',
          customerIndustry: 'IT',
          customerScale: 'large',
          productCategory: 'cloud_solution',
          contractedDaysToClose: 0,
          similarityScore: 0.95,
          successRate: 0.88,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        patternId: 'pattern-001',
        relevanceScore: 0.82,
        isApplicable: true,
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const newDealConditions = {
      customerId: 'cust-12345',
      customerIndustry: 'IT',
      customerScale: 'large',
      productCategory: 'cloud_solution',
      budgetRange: 'high',
      dealStage: 'initial_proposal',
    };

    const result = generateRecommendation(
      newDealConditions,
      mockAIRecommendationEngine
    );

    expect(result.recommendedPatterns).toBeDefined();
    expect(Array.isArray(result.recommendedPatterns)).toBe(true);
    expect(result.recommendedPatterns.length).toBeGreaterThan(0);

    const firstPattern = result.recommendedPatterns[0];
    expect(firstPattern).toBeDefined();
    expect(firstPattern.contractedDaysToClose).toBe(0);
    expect(firstPattern.relevanceScore).toBeGreaterThanOrEqual(0.8);

    expect(firstPattern.rationale).toBeDefined();
    expect(typeof firstPattern.rationale).toBe('string');
    expect(firstPattern.rationale).toMatch(/成約までの日数.*0日/);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealConditions
    );
    expect(
      mockAIRecommendationEngine.evaluatePatternRelevance
    ).toHaveBeenCalled();
  });
});