import { generateRecommendationWithImprovements } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1185
  test('[normal] 提案妥当性判定機能 - 提案内容から複数件の改善指摘が生成される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            id: '改善指摘1',
            category: 'approach',
            description: '初期接触では競合比較資料の事前配布が必要',
            priority: 'high',
          },
          {
            id: '改善指摘2',
            category: 'timeline',
            description: '3ヶ月の導入期間は業界標準に対して短い、リスク説明が必須',
            priority: 'medium',
          },
          {
            id: '改善指摘3',
            category: 'budget',
            description: '500万円予算に対し保守費用の提示が不足している',
            priority: 'medium',
          },
        ],
      }),
    };

    const proposalInput = {
      customerName: 'X社',
      proposalType: '初期接触提案',
      budgetLimit: 5000000,
      implementationPeriodMonths: 3,
    };

    return generateRecommendationWithImprovements(proposalInput, mockAIEngine).then(
      (result) => {
        expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(proposalInput);

        expect(result.recommendations).toHaveLength(3);

        const approachImprovements = result.recommendations.filter(
          (r) => r.category === 'approach'
        );
        expect(approachImprovements).toHaveLength(1);
        expect(approachImprovements[0]).toEqual({
          id: '改善指摘1',
          category: 'approach',
          description: '初期接触では競合比較資料の事前配布が必要',
          priority: 'high',
        });

        const timelineImprovements = result.recommendations.filter(
          (r) => r.category === 'timeline'
        );
        expect(timelineImprovements).toHaveLength(1);
        expect(timelineImprovements[0]).toEqual({
          id: '改善指摘2',
          category: 'timeline',
          description: '3ヶ月の導入期間は業界標準に対して短い、リスク説明が必須',
          priority: 'medium',
        });

        const budgetImprovements = result.recommendations.filter(
          (r) => r.category === 'budget'
        );
        expect(budgetImprovements).toHaveLength(1);
        expect(budgetImprovements[0]).toEqual({
          id: '改善指摘3',
          category: 'budget',
          description: '500万円予算に対し保守費用の提示が不足している',
          priority: 'medium',
        });

        const highPriorityCount = result.recommendations.filter(
          (r) => r.priority === 'high'
        ).length;
        expect(highPriorityCount).toBe(1);

        const mediumPriorityCount = result.recommendations.filter(
          (r) => r.priority === 'medium'
        ).length;
        expect(mediumPriorityCount).toBe(2);
      }
    );
  });
});