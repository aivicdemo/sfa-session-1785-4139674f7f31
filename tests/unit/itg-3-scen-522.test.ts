import { calculateQualityScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('DataQualityScoreCalculator - Quality Score Calculation with Error Rate Threshold', () => {
  test('SCEN-522: エラー率が閾値0%を超過するときスコアが低下する', () => {
    // テスト前提: AIRecommendationEngine をスタブ化
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.9),
    };

    // ケース1: エラー率 0% の参照値を計算
    const datasetNoErrors = {
      totalRecords: 100,
      errorRecords: 0,
      aiEngine: mockAIEngine,
    };

    const scoreWithZeroErrorRate = calculateQualityScore(datasetNoErrors);

    // ケース2: エラー率 1.0% のスコアを計算
    const datasetWithErrors = {
      totalRecords: 100,
      errorRecords: 1,
      aiEngine: mockAIEngine,
    };

    const scoreWithOnePercentErrorRate = calculateQualityScore(datasetWithErrors);

    // 検証1: エラー率 1.0% 時のスコアが 85 以下であることを確認
    expect(scoreWithOnePercentErrorRate).toBeLessThanOrEqual(85);

    // 検証2: エラー率 1.0% のスコアが、エラー率 0% のスコアよりも低下していることを確認
    expect(scoreWithZeroErrorRate).toBeGreaterThan(scoreWithOnePercentErrorRate);

    // 検証3: 差分が 5ポイント以上であることを確認
    const scoreDifference = scoreWithZeroErrorRate - scoreWithOnePercentErrorRate;
    expect(scoreDifference).toBeGreaterThanOrEqual(5);
  });
});