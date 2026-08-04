import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2178
  test('[edge] 顧客対応パターンと成功パターンのマッチスコア算出 - 顧客対応パターンが成功パターンとちょうど100%マッチするとき、マッチスコアが100で算出される', () => {
    const customer_pattern = {
      industry: '製造業',
      challenge: '生産効率化',
      budget_range: '1000万円以上',
      decision_makers_count: 3,
    };

    const success_pattern = {
      industry: '製造業',
      challenge: '生産効率化',
      budget_range: '1000万円以上',
      decision_makers_count: 3,
    };

    const match_score = evaluatePatternRelevance(
      customer_pattern,
      success_pattern
    );

    expect(match_score).toBe(100);
  });
});