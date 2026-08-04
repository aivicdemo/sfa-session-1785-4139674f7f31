import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  // SCEN-1735
  test('適用可能性評価値が0.49のとき推奨スコアを計算する', () => {
    const deal_condition = {
      customer_industry: 'IT',
      customer_size: 'large',
      deal_stage: 'proposal',
      customer_challenges: ['cost_reduction', 'efficiency'],
    };

    const pattern_data = {
      success_pattern_id: 'SP001',
      applicable_industries: ['IT', 'Finance'],
      applicable_sizes: ['large', 'medium'],
      success_count: 45,
      total_count: 92,
    };

    const ai_engine_stub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.49),
    };

    const recommended_score = evaluatePatternRelevance(
      deal_condition,
      pattern_data,
      ai_engine_stub.evaluatePatternRelevance
    );

    expect(recommended_score).toBe(49);
    expect(typeof recommended_score).toBe('number');
    expect(recommended_score).toBeLessThan(50);
  });
});