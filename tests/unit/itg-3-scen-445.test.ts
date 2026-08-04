import { calculateAggregateQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 品質スコア重み付け集計機能', () => {
  test('SCEN-445: 複数のカテゴリスコアが100の場合、総合スコアが100で算出される', () => {
    const proposalQualityScore = 100;
    const customerFitnessScore = 100;
    const successProbabilityScore = 100;
    
    const weights = {
      proposalQuality: 0.4,
      customerFitness: 0.35,
      successProbability: 0.25
    };

    const aggregateScore = calculateAggregateQualityScore(
      proposalQualityScore,
      customerFitnessScore,
      successProbabilityScore,
      weights
    );

    const expectedScore = Math.round(
      (proposalQualityScore * weights.proposalQuality) +
      (customerFitnessScore * weights.customerFitness) +
      (successProbabilityScore * weights.successProbability)
    );

    expect(aggregateScore).toBe(100);
    expect(aggregateScore).toBe(expectedScore);
  });
});