import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-967
  test('[error] 推奨根拠の可視化機能 - AIRecommendationEngine の explainRecommendationReasoning が API エラーを返すとき、簡略版根拠説明が返される', async () => {
    const dealId = 'deal_12345';
    const recommendationContent = {
      approachType: 'direct_proposal',
      proposedTiming: '2026-08-15',
      productCategory: 'enterprise_solution',
      estimatedValue: 5000000,
    };

    let apiCallCount = 0;
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockImplementation(async () => {
        apiCallCount++;
        if (apiCallCount <= 3) {
          const error = new Error('API Error');
          (error as any).status = 429;
          throw error;
        }
        return {
          reasoningText: 'Detailed explanation from API',
          fallback: false,
        };
      }),
    };

    const mockRecommendationPatternMaster = [
      {
        id: 'pattern_001',
        customerSize: 'large',
        industry: 'manufacturing',
        approachType: 'direct_proposal',
        successRate: 0.78,
        description: 'この顧客規模・業種では、過去成功事例から提案形式Aが最適な傾向です',
      },
      {
        id: 'pattern_002',
        customerSize: 'large',
        industry: 'manufacturing',
        approachType: 'referral_based',
        successRate: 0.65,
        description: '紹介ベースのアプローチも一定の成功率があります',
      },
    ];

    const result = await explainRecommendationReasoning(
      dealId,
      recommendationContent,
      mockAIEngine,
      mockRecommendationPatternMaster
    );

    expect(result).toEqual({
      reasoningText: 'この顧客規模・業種では、過去成功事例から提案形式Aが最適な傾向です',
      fallback: true,
      retryAttempts: 3,
      fallbackPatternId: 'pattern_001',
    });

    expect(apiCallCount).toBe(3);
  });
});