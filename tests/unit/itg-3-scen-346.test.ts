import { generateRecommendationWithImprovements } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-346
  test('[normal] 推奨精度検証機能 - 改善提案が生成される際、改善項目が1つの場合、その項目のみが提案される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        improvementItems: [
          {
            itemId: 'imp-001',
            category: '提案内容',
            description: '顧客の業種に特化した提案フレームワークを適用することで、提案の適合度を向上させる',
            priority: 'high',
          },
        ],
        confidenceScore: 85,
        reasoning: 'past case analysis',
      }),
    };

    const dealConditions = {
      customerId: 'cust-001',
      customerIndustry: '製造業',
      dealStage: '初期接触',
      challengeCategory: '生産効率化',
      dealAmount: 5000000,
    };

    const result = await generateRecommendationWithImprovements(
      dealConditions,
      mockAIEngine
    );

    expect(result.improvementItems).toHaveLength(1);
    expect(result.improvementItems[0].itemId).toBe('imp-001');
    expect(result.improvementItems[0].category).toBe('提案内容');
    expect(result.improvementItems[0].description).toBe(
      '顧客の業種に特化した提案フレームワークを適用することで、提案の適合度を向上させる'
    );
    expect(result.improvementItems[0].priority).toBe('high');
    expect(result.confidenceScore).toBe(85);
  });
});