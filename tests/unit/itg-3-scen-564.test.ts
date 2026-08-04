import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-564
  test('適用可能スコアがちょうど閾値0.5のとき成功パターンが適用可能と判定される', () => {
    const dealCondition = {
      customerIndustry: 'manufacturing',
      budgetScale: 5000000,
      decisionMakerCount: 3,
      implementationTimeframe: 90,
    };

    const successPattern = {
      patternId: 'PAT-2024-001',
      industry: 'manufacturing',
      budgetRange: { min: 3000000, max: 8000000 },
      decisionMakerRange: { min: 2, max: 5 },
      timeframeRange: { min: 60, max: 120 },
      historicalSuccessCount: 12,
      successRate: 0.85,
    };

    const relevanceScore = 0.5;

    const result = evaluatePatternRelevance(dealCondition, successPattern, relevanceScore);

    expect(result.isApplicable).toBe(true);
    expect(result.relevanceScore).toBe(0.5);
    expect(result.patternId).toBe('PAT-2024-001');
    expect(result.matchDegree).toBe(0.5);
    expect(typeof result.recommendationRationale).toBe('string');
    expect(result.recommendationRationale.length).toBeGreaterThan(0);
  });
});