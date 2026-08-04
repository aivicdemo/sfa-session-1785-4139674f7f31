import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能 - 過去商談データ0件時の動作', () => {
  // SCEN-2448
  test('過去商談成功データが0件のときスコアが推奨パターンマスタから計算される', () => {
    const customer_input = {
      industry: 'IT',
      scale: 'large',
      monthly_budget_jpy: 5000000,
    };

    const deal_condition = {
      deal_type: 'system_implementation',
      project_duration_months: 12,
      success_history_count: 0,
    };

    const recommendation_engine_stub = {
      evaluatePatternRelevance: jest.fn(() => ({
        relevance_score: 68,
        confidence_level: 'medium',
        reasoning: 'Matched with similar deal patterns in knowledge base',
      })),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendation_pattern_master_stub = [
      {
        pattern_id: 'pat_001',
        industry: 'IT',
        deal_type: 'system_implementation',
        success_rate: 0.75,
        applicable_scale: ['large'],
        pattern_description: 'IT業界向けシステム導入成功パターン',
        statistical_rank: 1,
      },
      {
        pattern_id: 'pat_002',
        industry: 'IT',
        deal_type: 'system_implementation',
        success_rate: 0.62,
        applicable_scale: ['large', 'medium'],
        pattern_description: 'IT業界向けシステム導入代替パターン',
        statistical_rank: 2,
      },
    ];

    const result = evaluatePatternRelevance(
      customer_input,
      deal_condition,
      recommendation_engine_stub,
      recommendation_pattern_master_stub
    );

    expect(result.recommendation_score).toBeGreaterThanOrEqual(0);
    expect(result.recommendation_score).toBeLessThanOrEqual(100);
    expect(result.recommendation_score).toBe(68);
    expect(result.explanation_source).toBe('pattern_master');
    expect(result.explanation_text).toBe(
      'IT業界向けシステム導入成功パターン'
    );
    expect(result.applied_pattern_id).toBe('pat_001');
    expect(recommendation_engine_stub.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: 'IT',
        scale: 'large',
        monthly_budget_jpy: 5000000,
      }),
      expect.objectContaining({
        deal_type: 'system_implementation',
        success_history_count: 0,
      })
    );
  });
});