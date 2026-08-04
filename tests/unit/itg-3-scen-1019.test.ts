import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1019
  test('推奨根拠が複数項目の場合、全項目が優先度順に説明文として生成される', () => {
    const mock_aiRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoningItems: [
          {
            priority: 1,
            score: 0.95,
            explanation: '顧客の業界は製造業で、過去同業種での成功事例が5件あり、提案アプローチAが98%の成約率を達成している'
          },
          {
            priority: 2,
            score: 0.87,
            explanation: '顧客の予算規模は1,000万円以上で、類似規模案件での平均契約期間は24ヶ月、追加サービス購買率が67%である'
          },
          {
            priority: 3,
            score: 0.72,
            explanation: '顧客の意思決定者は技術部門長で、過去同職位との商談では技術仕様の詳細説明が決定要因になっている'
          }
        ]
      })
    };

    const recommendationId = 'rec_test_001';
    const customerId = 'cust_test_001';
    const dealConditions = {
      industry: '製造業',
      budget: 10000000,
      decisionMaker: '技術部門長'
    };

    const result = explainRecommendationReasoning(
      recommendationId,
      customerId,
      dealConditions,
      mock_aiRecommendationEngine
    );

    expect(result).toBeDefined();
    expect(result.reasoningItems).toHaveLength(3);

    expect(result.reasoningItems[0].priority).toBe(1);
    expect(result.reasoningItems[0].score).toBe(0.95);
    expect(result.reasoningItems[0].explanation).toContain('製造業');
    expect(result.reasoningItems[0].explanation).toContain('98%');
    expect(result.reasoningItems[0].explanation).toContain('成約率');

    expect(result.reasoningItems[1].priority).toBe(2);
    expect(result.reasoningItems[1].score).toBe(0.87);
    expect(result.reasoningItems[1].explanation).toContain('1,000万円');
    expect(result.reasoningItems[1].explanation).toContain('24ヶ月');
    expect(result.reasoningItems[1].explanation).toContain('67%');

    expect(result.reasoningItems[2].priority).toBe(3);
    expect(result.reasoningItems[2].score).toBe(0.72);
    expect(result.reasoningItems[2].explanation).toContain('技術部門長');
    expect(result.reasoningItems[2].explanation).toContain('技術仕様');

    const visibleExplanation = result.reasoningItems
      .map(item => item.explanation)
      .join('\n');

    expect(visibleExplanation.indexOf('製造業')).toBeLessThan(
      visibleExplanation.indexOf('1,000万円')
    );
    expect(visibleExplanation.indexOf('1,000万円')).toBeLessThan(
      visibleExplanation.indexOf('技術部門長')
    );

    const prioritySortedCorrectly = result.reasoningItems.every((item, index) => {
      if (index === 0) return item.priority === 1 && item.score === 0.95;
      if (index === 1) return item.priority === 2 && item.score === 0.87;
      if (index === 2) return item.priority === 3 && item.score === 0.72;
      return false;
    });
    expect(prioritySortedCorrectly).toBe(true);
  });
});