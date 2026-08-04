import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-806
  test('[normal] 推奨内容と根拠の統合提示機能 - 商談情報が根拠データに含まれて返却される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: '顧客の既存システムとの統合提案',
        confidenceScore: 0.87,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: '過去の提案段階案件のうち製造業で500万円規模の案件では、統合提案が75%の成約率を達成しています',
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    const transactionData = {
      customerName: 'A社',
      stage: '提案段階',
      amount: 5000000,
      industry: '製造業',
    };

    const result = await generateRecommendationWithReasoning(
      transactionData,
      mockAIRecommendationEngine
    );

    expect(result).toHaveProperty('recommendation');
    expect(result.recommendation).toHaveProperty('reasons');
    expect(Array.isArray(result.recommendation.reasons)).toBe(true);
    expect(result.recommendation.reasons.length).toBeGreaterThan(0);

    const firstReason = result.recommendation.reasons[0];
    expect(firstReason).toHaveProperty('transactionInfo');
    expect(firstReason.transactionInfo).toEqual({
      customerName: 'A社',
      stage: '提案段階',
      amount: 5000000,
      industry: '製造業',
    });

    expect(firstReason).toHaveProperty('explanation');
    expect(firstReason.explanation).toContain(
      '過去の提案段階案件のうち製造業で500万円規模の案件では、統合提案が75%の成約率を達成しています'
    );

    expect(result.recommendation).toHaveProperty('confidenceScore');
    expect(result.recommendation.confidenceScore).toBe(0.87);
  });
});