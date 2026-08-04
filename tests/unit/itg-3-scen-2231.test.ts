import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-2231
  test('類似度スコアが0.0（不一致）のパターンは推奨から除外される', () => {
    const mockPatternA = {
      pattern_id: 'PAT-001',
      customer_industry: 'manufacturing',
      budget_range_min: 1000000,
      budget_range_max: 5000000,
      proposal_duration_days: 30,
      success_rate: 0.85,
      created_at: '2024-01-01T00:00:00Z',
    };

    const mockPatternB = {
      pattern_id: 'PAT-002',
      customer_industry: 'retail',
      budget_range_min: 100000,
      budget_range_max: 500000,
      proposal_duration_days: 14,
      success_rate: 0.50,
      created_at: '2024-01-02T00:00:00Z',
    };

    const mockPatternC = {
      pattern_id: 'PAT-003',
      customer_industry: 'manufacturing',
      budget_range_min: 2000000,
      budget_range_max: 8000000,
      proposal_duration_days: 45,
      success_rate: 0.80,
      created_at: '2024-01-03T00:00:00Z',
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((pattern: any) => {
        if (pattern.pattern_id === 'PAT-001') return 0.8;
        if (pattern.pattern_id === 'PAT-002') return 0.0;
        if (pattern.pattern_id === 'PAT-003') return 0.6;
        return 0.0;
      }),
      findSimilarPatterns: jest.fn(() => [
        { ...mockPatternA, relevance_score: 0.8 },
        { ...mockPatternB, relevance_score: 0.0 },
        { ...mockPatternC, relevance_score: 0.6 },
      ]),
      generateRecommendation: jest.fn((newDeal: any, filteredPatterns: any[]) => ({
        recommendation_id: 'REC-001',
        deal_id: newDeal.deal_id,
        recommended_patterns: filteredPatterns,
        approach_summary: 'Based on matched success patterns',
        confidence_score: 0.78,
        generated_at: '2024-01-15T11:00:00Z',
      })),
      explainRecommendationReasoning: jest.fn((recommendation: any) => ({
        reasoning: `Matched patterns: ${recommendation.recommended_patterns.map((p: any) => p.pattern_id).join(', ')}. Similarity scores above 0.0 threshold.`,
        referenced_patterns: recommendation.recommended_patterns.map((p: any) => p.pattern_id),
      })),
    };

    const newDeal = {
      deal_id: 'DEAL-2024-001',
      customer_industry: 'manufacturing',
      budget_allocated: 3000000,
      proposal_period_days: 35,
    };

    const result = generateRecommendation(newDeal, mockAIEngine);

    expect(result.recommended_patterns).toHaveLength(2);
    expect(result.recommended_patterns.map((p: any) => p.pattern_id)).toEqual(['PAT-001', 'PAT-003']);
    expect(result.recommended_patterns.map((p: any) => p.relevance_score)).toEqual([0.8, 0.6]);
    expect(result.recommended_patterns.some((p: any) => p.pattern_id === 'PAT-002')).toBe(false);

    const explanation = mockAIEngine.explainRecommendationReasoning(result);
    expect(explanation.referenced_patterns).toHaveLength(2);
    expect(explanation.referenced_patterns).not.toContain('PAT-002');
    expect(explanation.reasoning).not.toMatch(/PAT-002/);
  });
});