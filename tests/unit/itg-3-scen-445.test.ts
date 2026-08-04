import { calculateAggregateQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 品質スコア重み付け集計機能', () => {
  test('SCEN-445: 複数のカテゴリスコアが100の場合、総合スコアが100で算出される', () => {
    // Arrange: テストデータ設定
    const proposalQualityScore = 100;
    const customerFitnessScore = 100;
    const successProbabilityScore = 100;

    const proposalQualityWeight = 0.4;
    const customerFitnessWeight = 0.35;
    const successProbabilityWeight = 0.25;

    const categoryScores = {
      proposalQuality: proposalQualityScore,
      customerFitness: customerFitnessScore,
      successProbability: successProbabilityScore,
    };

    const weights = {
      proposalQuality: proposalQualityWeight,
      customerFitness: customerFitnessWeight,
      successProbability: successProbabilityWeight,
    };

    // Act: 品質スコア重み付け集計ロジックを呼び出し
    const aggregateScore = calculateAggregateQualityScore(categoryScores, weights);

    // Assert: 期待される計算結果を検証
    // (100 × 0.4) + (100 × 0.35) + (100 × 0.25) = 40 + 35 + 25 = 100
    const expectedAggregateScore = 100;
    expect(aggregateScore).toBe(expectedAggregateScore);
  });
});