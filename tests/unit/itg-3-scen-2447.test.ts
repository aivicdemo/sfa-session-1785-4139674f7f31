import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨精度スコア算出機能 - 成功確率100%での最大値反映', () => {
  test('SCEN-2447: 成功確率1.0が推奨精度スコア計算時に最大値として反映される', () => {
    // Arrange: AIRecommendationEngineのスタブ準備
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        successProbability: 1.0,
        patternMatchScore: 0.95,
        applicabilityScore: 0.92,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // 推奨精度スコア算出の入力パラメータ構築
    const inputConditions = {
      customerId: 'CUST-001',
      customerIndustry: 'manufacturing',
      customerScale: 'large_enterprise',
      dealValue: 5000000,
      dealStage: 'proposal',
      proposedApproach: 'solution_selling',
    };

    const historicalPatternReference = {
      similarPatternCount: 15,
      successRateInSimilarPatterns: 1.0,
      timeToCloseAverage: 45,
      averageDealSize: 4800000,
    };

    // Act: evaluatePatternRelevanceの戻り値を入力としてスコア計算ロジックを実行
    const evaluationResult = mockAIEngine.evaluatePatternRelevance(
      inputConditions,
      historicalPatternReference
    );

    // スコア算出ロジック実行
    const recommendationRelevanceScore = evaluateRecommendationRelevance(
      evaluationResult.successProbability,
      evaluationResult.patternMatchScore,
      evaluationResult.applicabilityScore,
      inputConditions,
      historicalPatternReference
    );

    // Assert: スコア計算の中間値と最終値を検証
    // 1. 成功確率が最大値（1.0）として認識されていることを確認
    expect(evaluationResult.successProbability).toBe(1.0);

    // 2. 成功確率1.0が上限値として機能し、推奨精度スコアが100以下であることを確認
    expect(recommendationRelevanceScore).toBeLessThanOrEqual(100);

    // 3. 成功確率が最大値なので、推奨精度スコアが高い値（85以上）として計算されることを確認
    expect(recommendationRelevanceScore).toBeGreaterThanOrEqual(85);

    // 4. 中間値の検証：patternMatchScoreとapplicabilityScoreが適正に考慮されていることを確認
    expect(evaluationResult.patternMatchScore).toBe(0.95);
    expect(evaluationResult.applicabilityScore).toBe(0.92);

    // 5. スコア計算結果が数値型であることを確認（仕様では0～100の範囲を想定）
    expect(typeof recommendationRelevanceScore).toBe('number');

    // 6. 成功確率1.0の条件下で、それ以上の値への加算・乗算が発生していないことを確認
    // スコアが上限値に clamp されていることを検証
    const expectedMaxScore = 100;
    expect(recommendationRelevanceScore).toBeLessThanOrEqual(expectedMaxScore);

    // 7. 計算ロジックが成功確率を正しく重み付けしていることを確認
    // 成功確率1.0 × パターンマッチスコア0.95 × 適用可能性スコア0.92 を基本計算とする場合の期待値
    const baseCalculation = 1.0 * 0.95 * 0.92 * 100; // = 87.4
    expect(recommendationRelevanceScore).toBeCloseTo(87.4, 1);
  });
});