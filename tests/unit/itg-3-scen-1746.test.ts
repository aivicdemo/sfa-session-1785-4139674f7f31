import { visualizeRecommendationRationale } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1746
  test('根拠ウェイトが0のとき根拠を除外する', () => {
    const mockAIRecommendationResponse = {
      recommendationId: 'rec-20240115-001',
      proposalApproach: '大規模製造業向けの包括的ソリューション提案',
      rationale: [
        {
          reason: '顧客規模が大規模',
          weight: 0.8
        },
        {
          reason: '業界が製造業',
          weight: 0
        },
        {
          reason: '予算規模が大',
          weight: 0.6
        }
      ],
      confidenceScore: 85
    };

    const result = visualizeRecommendationRationale(mockAIRecommendationResponse);

    expect(result.filteredRationale).toHaveLength(2);

    expect(result.filteredRationale[0]).toEqual({
      reason: '顧客規模が大規模',
      weight: 0.8
    });

    expect(result.filteredRationale[1]).toEqual({
      reason: '予算規模が大',
      weight: 0.6
    });

    expect(result.filteredRationale).not.toContainEqual({
      reason: '業界が製造業',
      weight: 0
    });

    expect(result.filteredRationale[0].weight).toBe(0.8);
    expect(result.filteredRationale[1].weight).toBe(0.6);
  });
});