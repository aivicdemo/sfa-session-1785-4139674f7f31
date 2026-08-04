import { displayRecommendationApproaches } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-2254: 複数の推奨提案アプローチが優先度順に表示される', () => {
    // Arrange
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approaches: [
          {
            id: 'approach_A',
            name: '提案アプローチA',
            priority: 1,
            relevanceScore: 0.95,
          },
          {
            id: 'approach_B',
            name: '提案アプローチB',
            priority: 2,
            relevanceScore: 0.87,
          },
          {
            id: 'approach_C',
            name: '提案アプローチC',
            priority: 3,
            relevanceScore: 0.72,
          },
        ],
      }),
      explainRecommendationReasoning: jest
        .fn()
        .mockImplementation((approachId) => {
          const explanations: Record<string, string> = {
            approach_A:
              '製造業の顧客のコスト削減課題に対して、過去の成功事例から推奨される提案アプローチです。',
            approach_B:
              '中程度の信頼度で適用可能な提案アプローチであり、追加のヒアリングが推奨されます。',
            approach_C:
              '限定的な状況での提案アプローチであり、他の提案との組み合わせを検討してください。',
          };
          return Promise.resolve(explanations[approachId] || '');
        }),
    };

    const dealCondition = {
      industry: '製造業',
      issue: 'コスト削減',
      budgetRange: '500万円以上',
      customerId: 'cust_12345',
      dealId: 'deal_67890',
    };

    // Act
    const result = displayRecommendationApproaches(
      dealCondition,
      mockRecommendationEngine
    );

    // Assert
    expect(result).resolves.toEqual({
      displayOrder: [
        {
          position: 0,
          id: 'approach_A',
          name: '提案アプローチA',
          priority: 1,
          relevanceScore: 95,
          relevanceScorePercentage: '95%',
          reasoning:
            '製造業の顧客のコスト削減課題に対して、過去の成功事例から推奨される提案アプローチです。',
        },
        {
          position: 1,
          id: 'approach_B',
          name: '提案アプローチB',
          priority: 2,
          relevanceScore: 87,
          relevanceScorePercentage: '87%',
          reasoning:
            '中程度の信頼度で適用可能な提案アプローチであり、追加のヒアリングが推奨されます。',
        },
        {
          position: 2,
          id: 'approach_C',
          name: '提案アプローチC',
          priority: 3,
          relevanceScore: 72,
          relevanceScorePercentage: '72%',
          reasoning:
            '限定的な状況での提案アプローチであり、他の提案との組み合わせを検討してください。',
        },
      ],
      totalApproaches: 3,
      sortedByPriority: true,
    });

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      dealCondition
    );
    expect(
      mockRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalledTimes(3);
  });
});