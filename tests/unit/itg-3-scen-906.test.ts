import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン照合機能 - 適用可能性スコア照合判定', () => {
  // SCEN-906
  test('適用可能性スコアが閾値100直下（99.9）で照合結果の適用判定がなされる', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        applicabilityScore: 99.9,
        isApplicable: true,
        matchedPatternId: 'pattern_success_mfg_2024_001',
        confidenceLevel: 'HIGH'
      })
    };

    const dealConditions = {
      customerIndustry: '製造業',
      budgetAmount: 5000000,
      decisionMakersCount: 3,
      dealStage: 'initial_proposal',
      productCategory: 'enterprise_solution'
    };

    const successPattern = {
      patternId: 'pattern_success_mfg_2024_001',
      customerIndustry: '製造業',
      budgetRangeMin: 3000000,
      budgetRangeMax: 10000000,
      decisionMakersMin: 2,
      decisionMakersMax: 5,
      successRate: 0.875,
      applicableDealStages: ['initial_proposal', 'detailed_proposal']
    };

    const result = evaluatePatternRelevance(
      dealConditions,
      successPattern,
      mockAIEngine
    );

    expect(result.applicabilityScore).toBe(99.9);
    expect(result.isApplicable).toBe(true);
    expect(result.matchedPatternId).toBe('pattern_success_mfg_2024_001');
    expect(result.confidenceLevel).toBe('HIGH');
  });
});