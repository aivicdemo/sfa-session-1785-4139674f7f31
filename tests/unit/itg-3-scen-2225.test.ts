import { findSimilarPatterns, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  test('SCEN-2225: 新規案件の商談条件が過去成功パターンと照合される', async () => {
    // テスト用の新規案件データ
    const newDealCondition = {
      industryType: 'manufacturing',
      budgetAmount: 50000000,
      businessChallenge: 'production_efficiency',
      decisionMakersCount: 3,
    };

    // テスト用の過去成功パターンデータ
    const pastPatternA = {
      id: 'past-pattern-a-001',
      industryType: 'manufacturing',
      budgetMin: 40000000,
      budgetMax: 60000000,
      businessChallenge: 'production_efficiency',
      decisionMakersMin: 2,
      decisionMakersMax: 4,
      outcome: 'closed_won',
      successCount: 12,
    };

    const pastPatternB = {
      id: 'past-pattern-b-002',
      industryType: 'retail',
      budgetMin: 20000000,
      budgetMax: 40000000,
      businessChallenge: 'inventory_management',
      decisionMakersMin: 1,
      decisionMakersMax: 2,
      outcome: 'closed_lost',
      successCount: 2,
    };

    // AIRecommendationEngineのモック設定
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'past-pattern-a-001',
          similarityScore: 0.92,
          pattern: pastPatternA,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patternId: 'past-pattern-a-001',
        applicabilityScore: 0.88,
        matchReason: [
          'customer_industry_matched',
          'budget_range_matched',
          'challenge_matched',
          'decision_makers_within_range',
        ],
      }),
    };

    // 推奨生成関数を呼び出す
    const similarPatternsResult = await findSimilarPatterns(
      newDealCondition,
      mockAIEngine
    );

    // findSimilarPatternsが呼び出されたことを検証
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);

    // 類似パターンの結果を検証
    expect(similarPatternsResult).toHaveLength(1);
    expect(similarPatternsResult[0].patternId).toBe('past-pattern-a-001');
    expect(similarPatternsResult[0].similarityScore).toBe(0.92);

    // 適用可能性スコアを評価
    const relevanceResult = await evaluatePatternRelevance(
      similarPatternsResult[0].patternId,
      newDealCondition,
      mockAIEngine
    );

    // evaluatePatternRelevanceが呼び出されたことを検証
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      'past-pattern-a-001',
      newDealCondition
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);

    // 適用可能性評価の結果を検証
    expect(relevanceResult.patternId).toBe('past-pattern-a-001');
    expect(relevanceResult.applicabilityScore).toBe(0.88);
    expect(relevanceResult.matchReason).toContain('customer_industry_matched');
    expect(relevanceResult.matchReason).toContain('budget_range_matched');
    expect(relevanceResult.matchReason).toContain('challenge_matched');
    expect(relevanceResult.matchReason).toContain(
      'decision_makers_within_range'
    );

    // 推奨結果オブジェクトの構成を検証
    const recommendationResult = {
      recommendedPatternId: relevanceResult.patternId,
      similarityScore: similarPatternsResult[0].similarityScore,
      applicabilityScore: relevanceResult.applicabilityScore,
      matchingRationale: `顧客業種・課題・予算帯が合致、意思決定者数が範囲内`,
      recommendationConfidencePercent: Math.round(
        relevanceResult.applicabilityScore * 100
      ),
      sourcePattern: {
        industryType: pastPatternA.industryType,
        businessChallenge: pastPatternA.businessChallenge,
      },
    };

    // 推奨結果の整合性を検証
    expect(recommendationResult.recommendedPatternId).toBe(
      'past-pattern-a-001'
    );
    expect(recommendationResult.similarityScore).toBe(0.92);
    expect(recommendationResult.applicabilityScore).toBe(0.88);
    expect(recommendationResult.recommendationConfidencePercent).toBe(88);
    expect(recommendationResult.sourcePattern.industryType).toBe(
      'manufacturing'
    );
    expect(recommendationResult.sourcePattern.businessChallenge).toBe(
      'production_efficiency'
    );
  });
});