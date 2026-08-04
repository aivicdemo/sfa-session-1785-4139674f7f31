import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1787: [normal] 推奨根拠の可視化機能 - AIエージェント呼び出し成功時、OpenAI APIから返却された理由が根拠に含まれる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: '提案アプローチ: IT業界向けの包括的なデジタル変革支援プログラムを提案',
        reasoning: '顧客の業界が過去成功事例と同じIT業界で、予算規模が500万円以上1000万円以下という条件が一致したため',
        confidenceScore: 85,
      }),
      explainRecommendationReasoning: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerInfo = {
      industry: 'IT',
      budgetAmount: 7000000,
      companySize: 'mid-market',
    };

    const dealConditions = {
      dealType: 'digital_transformation',
      targetDepartment: 'management',
      timeline: 'Q3_2024',
    };

    const result = generateRecommendationWithReasoning(
      customerInfo,
      dealConditions,
      mockAIEngine,
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      customerInfo,
      dealConditions,
    );

    expect(result.visualizationContent).toContain(
      '顧客の業界が過去成功事例と同じIT業界で、予算規模が500万円以上1000万円以下という条件が一致したため',
    );

    expect(result.reasoning).toBe(
      '顧客の業界が過去成功事例と同じIT業界で、予算規模が500万円以上1000万円以下という条件が一致したため',
    );

    expect(result.confidenceScore).toBe(85);
    expect(result.recommendation).toBe(
      '提案アプローチ: IT業界向けの包括的なデジタル変革支援プログラムを提案',
    );
  });
});