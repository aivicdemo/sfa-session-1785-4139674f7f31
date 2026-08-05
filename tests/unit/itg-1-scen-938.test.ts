import { calculatePrioritizationScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-938: [normal] 改善優先度スコア算出機能 - 提案内容の問題パターンから改善優先度スコアが正しく算出される
  test('提案内容に複数の問題パターンが存在する場合、改善優先度スコアが正しい範囲内で算出され、重み付け係数が適切に反映される', () => {
    const proposalIssues = {
      customer_needs_deviation: true,
      insufficient_proposal_basis: true,
      missing_competitor_strategy: true,
    };

    const result = calculatePrioritizationScore(proposalIssues);

    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.score).toBeLessThanOrEqual(95);

    expect(result.weightedContributions).toBeDefined();
    expect(typeof result.weightedContributions.customer_needs_deviation).toBe('number');
    expect(typeof result.weightedContributions.insufficient_proposal_basis).toBe('number');
    expect(typeof result.weightedContributions.missing_competitor_strategy).toBe('number');

    expect(result.weightedContributions.customer_needs_deviation).toBeGreaterThan(
      result.weightedContributions.insufficient_proposal_basis
    );
    expect(result.weightedContributions.customer_needs_deviation).toBeGreaterThan(
      result.weightedContributions.missing_competitor_strategy
    );

    expect(result.maxWeightedContributionKey).toBe('customer_needs_deviation');

    const sumWeightedContributions =
      result.weightedContributions.customer_needs_deviation +
      result.weightedContributions.insufficient_proposal_basis +
      result.weightedContributions.missing_competitor_strategy;
    expect(sumWeightedContributions).toBeCloseTo(result.score, 0);
  });
});