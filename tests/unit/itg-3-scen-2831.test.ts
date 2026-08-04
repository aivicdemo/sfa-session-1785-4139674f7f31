import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2831
  test('複数の根拠要素が重要度でソートされて返却される', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: [
          {
            element: '根拠A',
            importance: 0.95,
            description: 'Past success pattern match'
          },
          {
            element: '根拠B',
            importance: 0.72,
            description: 'Customer segment alignment'
          },
          {
            element: '根拠C',
            importance: 0.88,
            description: 'Timing indicator detected'
          },
          {
            element: '根拠D',
            importance: 0.65,
            description: 'Market trend correlation'
          }
        ]
      })
    };

    const recommendationId = 'rec-2024-001';
    const result = await explainRecommendationReasoning(
      recommendationId,
      mockAIEngine
    );

    expect(result).toHaveLength(4);
    expect(result[0].element).toBe('根拠A');
    expect(result[0].importance).toBe(0.95);
    expect(result[1].element).toBe('根拠C');
    expect(result[1].importance).toBe(0.88);
    expect(result[2].element).toBe('根拠B');
    expect(result[2].importance).toBe(0.72);
    expect(result[3].element).toBe('根拠D');
    expect(result[3].importance).toBe(0.65);
  });
});