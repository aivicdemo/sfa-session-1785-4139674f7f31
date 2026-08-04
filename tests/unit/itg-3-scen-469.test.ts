import { generateCustomizedImprovementRecommendations } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導施策推奨機能', () => {
  // SCEN-469
  test('複数の改善対象項目がある場合、項目ごとの具体的施策が推奨される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            improvementItem: 'コスト削減',
            tactics: [
              {
                tactic: '資材仕入れ先の一括化',
                rationale: '複数の仕入れ先をまとめることで、スケールメリットを享受し、単価を15-20%削減できます。',
                expectedImpact: 18
              }
            ]
          },
          {
            improvementItem: '納期短縮',
            tactics: [
              {
                tactic: '生産工程の並列化',
                rationale: '順次工程を並列処理に変更することで、全体のリードタイムを25-30%削減できます。',
                expectedImpact: 28
              }
            ]
          },
          {
            improvementItem: '品質向上',
            tactics: [
              {
                tactic: '検査体制の強化',
                rationale: '多段階検査体制の導入により、不良率を現行の2.5%から0.8%に削減できます。',
                expectedImpact: 68
              }
            ]
          }
        ]
      })
    };

    const customerCondition = {
      industry: '製造業',
      improvementFocusAreas: ['コスト削減', '納期短縮', '品質向上'],
      companySize: 'mid-size',
      currentChallenges: ['material_cost', 'delivery_time', 'defect_rate']
    };

    const dealCondition = {
      productCategory: 'manufacturing_optimization',
      targetBudgetRange: { min: 1000000, max: 5000000 },
      implementationTimeframe: 'Q2-Q3'
    };

    const result = generateCustomizedImprovementRecommendations(
      customerCondition,
      dealCondition,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith({
      industry: '製造業',
      improvementFocusAreas: ['コスト削減', '納期短縮', '品質向上'],
      companySize: 'mid-size',
      currentChallenges: ['material_cost', 'delivery_time', 'defect_rate'],
      productCategory: 'manufacturing_optimization',
      targetBudgetRange: { min: 1000000, max: 5000000 },
      implementationTimeframe: 'Q2-Q3'
    });

    expect(result.recommendations).toHaveLength(3);

    expect(result.recommendations[0]).toEqual({
      improvementItem: 'コスト削減',
      tactics: [
        {
          tactic: '資材仕入れ先の一括化',
          rationale: '複数の仕入れ先をまとめることで、スケールメリットを享受し、単価を15-20%削減できます。',
          expectedImpact: 18
        }
      ]
    });

    expect(result.recommendations[1]).toEqual({
      improvementItem: '納期短縮',
      tactics: [
        {
          tactic: '生産工程の並列化',
          rationale: '順次工程を並列処理に変更することで、全体のリードタイムを25-30%削減できます。',
          expectedImpact: 28
        }
      ]
    });

    expect(result.recommendations[2]).toEqual({
      improvementItem: '品質向上',
      tactics: [
        {
          tactic: '検査体制の強化',
          rationale: '多段階検査体制の導入により、不良率を現行の2.5%から0.8%に削減できます。',
          expectedImpact: 68
        }
      ]
    });

    expect(result.recommendations[0].tactics[0].tactic).toBe('資材仕入れ先の一括化');
    expect(result.recommendations[1].tactics[0].tactic).toBe('生産工程の並列化');
    expect(result.recommendations[2].tactics[0].tactic).toBe('検査体制の強化');

    result.recommendations.forEach((recommendation) => {
      expect(recommendation.improvementItem).toBeDefined();
      expect(recommendation.tactics).toBeDefined();
      expect(Array.isArray(recommendation.tactics)).toBe(true);
      recommendation.tactics.forEach((tacticItem) => {
        expect(tacticItem.rationale).toBeDefined();
        expect(tacticItem.rationale).not.toBe('');
        expect(typeof tacticItem.expectedImpact).toBe('number');
        expect(tacticItem.expectedImpact).toBeGreaterThanOrEqual(0);
        expect(tacticItem.expectedImpact).toBeLessThanOrEqual(100);
      });
    });
  });
});