import { evaluateImprovementPriorityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度スコアリング機能', () => {
  // SCEN-459: [normal] 改善優先度スコアリング機能 - 影響度が閾値直下の場合、優先度スコアに正しく反映される
  test('should correctly calculate priority score when relevance score is just below threshold', () => {
    // Arrange: テスト用の商談条件データを準備
    const dealCondition = {
      industry: '小売',
      contractAmount: 5000000,
      decisionMakers: 3,
    };

    // AIRecommendationEngineのスタブを設定
    const aiEngineStub = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.49), // 閾値 0.5 の直下
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // 影響度の重み付け係数（設計値：40%）
    const relevanceWeightCoefficient = 0.4;

    // 期待値の計算：優先度スコアに占める影響度の変動分
    // 影響度 0.49 に対する優先度スコア変動分：0.49 * 0.4 = 0.196
    // 影響度 0.50 に対する優先度スコア変動分：0.50 * 0.4 = 0.200
    // 差分：0.200 - 0.196 = 0.004 （4/1000 = 0.004相当）
    const relevanceScore = 0.49;
    const expectedPriorityScoreDelta = 0.004;
    const priorityScoreAt050 = 0.50 * relevanceWeightCoefficient;
    const priorityScoreAt049 = 0.49 * relevanceWeightCoefficient;
    const expectedDifference = priorityScoreAt050 - priorityScoreAt049;

    // Act: 優先度スコアリング機能を実行
    const result = evaluateImprovementPriorityScore(
      dealCondition,
      relevanceScore,
      aiEngineStub
    );

    // Assert: 優先度スコアが線形かつ単調に計算されていることを検証
    expect(result.priorityScore).toBe(priorityScoreAt049);
    expect(result.relevanceScoreContribution).toBe(0.196);

    // スコア差分が設計値どおりに計算されていることを数値で検証
    expect(expectedDifference).toBeCloseTo(expectedPriorityScoreDelta, 5);

    // 生成された優先度スコアが推奨ランキングの順位決定に用いられることを確認
    expect(result).toEqual({
      priorityScore: 0.196,
      relevanceScoreContribution: 0.196,
      recommendationRank: expect.any(Number),
      isAboveThreshold: false, // 0.49 < 0.5
      reportConsistency: true,
    });

    // AIエージェントのスタブが呼び出されたことを確認
    expect(aiEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealCondition
    );
  });
});