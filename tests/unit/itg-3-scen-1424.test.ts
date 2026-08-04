import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1424
  test('類似パターンマッチスコアが閾値と等しいとき、適用可能と判定される', () => {
    const threshold = 0.75;
    const similarityScore = 0.75;

    const successPattern = {
      pattern_id: 'PATTERN_001',
      customer_industry: 'manufacturing',
      customer_size: 'large',
      sales_stage: 'proposal',
      approach_template: 'consultative_selling',
      success_count: 15,
      failure_count: 2,
      similarity_score: similarityScore,
    };

    const result = evaluatePatternRelevance(successPattern, threshold);

    expect(result.applicable).toBe(true);
    expect(result.status).toBe('APPLICABLE');
    expect(result.score).toBe(0.75);
    expect(result.recommendation_candidates).toContain(successPattern.pattern_id);
  });
});