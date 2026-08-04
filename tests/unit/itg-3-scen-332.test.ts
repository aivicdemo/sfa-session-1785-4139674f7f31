import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-332
  test('成功した商談99件の精度計測に全件が包含されることを確認', () => {
    // Arrange: テスト用AIRecommendationEngineスタブの設定
    const mockFindSimilarPatterns = jest.fn();
    const mockEvaluatePatternRelevance = jest.fn();

    // 99件の成功商談データを生成
    const successfulDealDataset = Array.from({ length: 99 }, (_, index) => ({
      dealId: `deal_${String(index + 1).padStart(3, '0')}`,
      customerId: `customer_${String(Math.floor(index / 10) + 1).padStart(2, '0')}`,
      dealStatus: 'won',
      dealAmount: 100000 + index * 10000,
      dealDate: new Date('2024-01-01').toISOString(),
      recommendationPatternScore: 0.7 + (index % 30) * 0.01,
      successIndicator: true,
    }));

    // findSimilarPatterns: 99件全てのマッチングパターンを返却
    mockFindSimilarPatterns.mockResolvedValue(
      successfulDealDataset.map((deal, idx) => ({
        patternId: `pattern_${String(idx + 1).padStart(3, '0')}`,
        dealId: deal.dealId,
        similarity: 0.65 + (idx % 35) * 0.01,
        successRate: 0.55 + (idx % 45) * 0.009,
      }))
    );

    // evaluatePatternRelevance: 各パターンに対してスコア化（0-100）
    mockEvaluatePatternRelevance.mockImplementation((pattern) => {
      const baseScore = Math.floor(pattern.similarity * 100);
      const adjustedScore = baseScore + (pattern.successRate * 10);
      return Math.min(100, adjustedScore);
    });

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: mockFindSimilarPatterns,
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    // 対象期間の指定（99件全てを含むスコープ）
    const accuracyCheckParams = {
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      dealStatusFilter: 'won',
      aiEngine: aiRecommendationEngineStub,
    };

    // Act: 精度計測処理を実行
    const accuracyResult = evaluateRecommendationAccuracy(accuracyCheckParams);

    // Assert: 精度計測結果の検証
    expect(accuracyResult.sampledCount).toBe(99);
    expect(accuracyResult.evaluatedCount).toBe(99);

    // evaluatePatternRelevanceが99回呼び出されたことを確認
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledTimes(99);

    // 統計値の検証
    // 99件のスコアから平均値を計算
    const expectedScores = Array.from({ length: 99 }, (_, idx) => {
      const similarity = 0.65 + (idx % 35) * 0.01;
      const successRate = 0.55 + (idx % 45) * 0.009;
      const baseScore = Math.floor(similarity * 100);
      const adjustedScore = baseScore + successRate * 10;
      return Math.min(100, adjustedScore);
    });

    const expectedAverageScore =
      expectedScores.reduce((sum, score) => sum + score, 0) / 99;

    expect(accuracyResult.recommendationAccuracyScore).toBeCloseTo(
      expectedAverageScore,
      1
    );

    // 適用可能パターン数の検証（スコア70以上のパターン）
    const applicablePatternCount = expectedScores.filter(
      (score) => score >= 70
    ).length;
    expect(accuracyResult.applicablePatternCount).toBe(applicablePatternCount);

    // 最小・最大スコアの検証
    const minScore = Math.min(...expectedScores);
    const maxScore = Math.max(...expectedScores);
    expect(accuracyResult.minScore).toBe(minScore);
    expect(accuracyResult.maxScore).toBe(maxScore);

    // findSimilarPatternsが呼び出されたことを確認
    expect(mockFindSimilarPatterns).toHaveBeenCalled();
  });
});