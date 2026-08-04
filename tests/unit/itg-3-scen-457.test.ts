import { evaluatePrioritizationScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度スコアリング機能', () => {
  test('SCEN-457: エラー件数が閾値直上の場合、優先度スコアが正しく算出される', () => {
    // テスト対象の改善優先度スコアリング機能の初期化
    const errorThreshold = 100;
    const errorCountAboveThreshold = 101;
    const baseScore = 50;
    const weightCoefficient = 2.0;

    // AIRecommendationEngineのスタブ設定
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.85,
        isApplicable: true,
      }),
    };

    // 優先度スコアリング入力パラメータを標準値で設定
    const scoringInput = {
      errorCount: errorCountAboveThreshold,
      errorThreshold: errorThreshold,
      baseScore: baseScore,
      weightCoefficient: weightCoefficient,
      improvementEffectExpectancy: 0.8,
      implementationDifficulty: 0.6,
      customerImpactLevel: 0.75,
      aiRecommendationEngine: aiRecommendationEngineStub,
    };

    // 優先度スコアリング機能を実行
    const calculatedScore = evaluatePrioritizationScore(scoringInput);

    // 期待値の計算：基本スコア + （エラー件数 - 閾値）× 重み係数
    const expectedScore = baseScore + (errorCountAboveThreshold - errorThreshold) * weightCoefficient;
    // = 50 + (101 - 100) × 2.0 = 50 + 2.0 = 52.0

    // スコア値が正しく算出されていることを検証
    expect(calculatedScore).toBe(52.0);

    // 閾値ちょうど（100件）の場合のスコアとの差分を検証
    const scoringInputAtThreshold = {
      ...scoringInput,
      errorCount: errorThreshold,
    };

    const scoreAtThreshold = evaluatePrioritizationScore(scoringInputAtThreshold);
    // = 50 + (100 - 100) × 2.0 = 50.0

    expect(scoreAtThreshold).toBe(50.0);
    expect(calculatedScore - scoreAtThreshold).toBe(2.0);
  });
});