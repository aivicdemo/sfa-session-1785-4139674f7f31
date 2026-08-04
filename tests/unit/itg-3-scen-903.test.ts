import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン照合機能 - 適用可能性スコア0の境界値検証', () => {
  // SCEN-903
  test('適用可能性スコアが閾値0ちょうどの場合、照合結果として推奨パターンが返却され、適用判定がtrueになることを検証する', () => {
    const dealCondition = {
      customerIndustry: 'manufacturing',
      budgetScale: 5000000,
      dealStage: 'proposal',
      dealSize: 'large',
      customerSize: 'enterprise',
      productCategory: 'cloud_infrastructure',
    };

    const successPattern = {
      id: 'pattern_001',
      industry: 'manufacturing',
      budgetMin: 4000000,
      budgetMax: 6000000,
      recommendedApproach: 'digital_transformation_focus',
      successRate: 0.75,
      keyFactors: ['cost_reduction', 'process_automation'],
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.0,
        isApplicable: true,
        matchedFactors: ['budget_match', 'industry_match'],
        confidenceLevel: 0.5,
      }),
    };

    const result = evaluatePatternRelevance(
      dealCondition,
      successPattern,
      mockAIEngine,
    );

    expect(result.isApplicable).toBe(true);
    expect(result.relevanceScore).toBe(0.0);
    expect(result.recommendedPattern).toEqual(successPattern);
    expect(result.matchedFactors).toContain('budget_match');
    expect(result.matchedFactors).toContain('industry_match');
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealCondition,
      successPattern,
    );
  });
});