import { recordRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1825
  test('推奨根拠情報の統合機能 - 推奨根拠データが推奨根拠テーブルに正確に記録される', async () => {
    const testCustomerName = 'テスト太郎';
    const testIndustry = '製造業';
    const testBudget = 5000000;
    const testChallenge = '業務効率化';

    const recommendationId = 'REC-20260801-001';
    const recommendationApproach = 'DX導入支援提案';
    const rootReasoningScore = 0.87;
    const similarSuccessPatternCount = 3;
    const reasoningText =
      '過去の同業種案件で同等の予算規模における業務効率化提案の成約率が92%であることに基づく推奨';

    const mockAiRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId,
        approach: recommendationApproach,
        confidenceScore: rootReasoningScore,
        similarPatternsCount: similarSuccessPatternCount,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoningText,
      }),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputData = {
      customerName: testCustomerName,
      industry: testIndustry,
      budget: testBudget,
      challenge: testChallenge,
    };

    const fixedCreatedAt = new Date('2026-08-01T11:00:00Z');

    const mockDatabaseConnection = {
      query: jest.fn(),
      insert: jest.fn().mockResolvedValue({
        id: 1,
        recommendation_id: recommendationId,
        reasoning_text: reasoningText,
        pattern_similarity_score: rootReasoningScore,
        similar_patterns_count: similarSuccessPatternCount,
        created_at: fixedCreatedAt,
        status: 'confirmed',
      }),
    };

    const result = await recordRecommendationReasoning(
      inputData,
      mockAiRecommendationEngine,
      mockDatabaseConnection,
      fixedCreatedAt,
    );

    expect(mockAiRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      inputData,
    );
    expect(
      mockAiRecommendationEngine.explainRecommendationReasoning,
    ).toHaveBeenCalledWith(recommendationId);

    expect(mockDatabaseConnection.insert).toHaveBeenCalledWith(
      'recommendation_reasons',
      {
        recommendation_id: recommendationId,
        reasoning_text: reasoningText,
        pattern_similarity_score: rootReasoningScore,
        similar_patterns_count: similarSuccessPatternCount,
        created_at: fixedCreatedAt,
        status: 'confirmed',
      },
    );

    expect(result).toEqual({
      id: 1,
      recommendation_id: recommendationId,
      reasoning_text: reasoningText,
      pattern_similarity_score: rootReasoningScore,
      similar_patterns_count: similarSuccessPatternCount,
      created_at: fixedCreatedAt,
      status: 'confirmed',
    });

    expect(result.recommendation_id).toBe('REC-20260801-001');
    expect(result.reasoning_text).toBe(
      '過去の同業種案件で同等の予算規模における業務効率化提案の成約率が92%であることに基づく推奨',
    );
    expect(result.pattern_similarity_score).toBe(0.87);
    expect(result.similar_patterns_count).toBe(3);
    expect(result.status).toBe('confirmed');
  });
});