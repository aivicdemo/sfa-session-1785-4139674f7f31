import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン照合機能', () => {
  // SCEN-905
  test('適用可能性スコアが閾値100ちょうどで照合結果の適用判定がなされる', () => {
    const newCaseData = {
      companyScale: 'mid-market',
      industry: 'manufacturing',
      budgetAmount: 50000000,
    };

    const successPattern = {
      patternId: 'pat-2024-001',
      companyScale: 'mid-market',
      industry: 'manufacturing',
      budgetAmount: 50000000,
      successRate: 0.85,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 100.0,
        factors: ['company_scale_match', 'industry_match', 'budget_match'],
      }),
    };

    const result = evaluatePatternRelevance(
      newCaseData,
      successPattern,
      mockAIEngine
    );

    expect(result.applicable).toBe(true);
    expect(result.score).toBe(100.0);
    expect(result.patternId).toBe('pat-2024-001');
    expect(result.appliedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );
  });
});