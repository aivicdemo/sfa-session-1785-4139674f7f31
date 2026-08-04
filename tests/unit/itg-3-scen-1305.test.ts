import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1305
  test('[normal] 提案内容と顧客制約条件の自動照合機能 - 提案内容が顧客の予算制約を満たすとき、適合性スコアが正の値で計算される', () => {
    const proposal_amount = 800000;
    const customer_budget_limit = 1000000;

    const relevance_score = evaluatePatternRelevance(
      proposal_amount,
      customer_budget_limit
    );

    expect(relevance_score).toBeGreaterThan(0);
    expect(relevance_score).toBeLessThanOrEqual(1.0);
    expect(relevance_score).toBeCloseTo(0.8, 1);
  });
});