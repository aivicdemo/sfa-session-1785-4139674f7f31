import { visualizeRecommendationRationale } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨根拠の可視化機能', () => {
  // SCEN-2556
  test('推奨根拠リストが逆順で入力されるとき、信頼度スコアで昇順にソートされる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const reverseOrderedRationales = [
      {
        rationale_id: 'rat_001',
        recommendation_id: 'rec_001',
        basis_data: '過去事例A',
        confidentScore: 0.95,
        created_at: '2024-01-15T11:00:00Z',
      },
      {
        rationale_id: 'rat_002',
        recommendation_id: 'rec_001',
        basis_data: '過去事例B',
        confidentScore: 0.75,
        created_at: '2024-01-15T11:01:00Z',
      },
      {
        rationale_id: 'rat_003',
        recommendation_id: 'rec_001',
        basis_data: '過去事例C',
        confidentScore: 0.55,
        created_at: '2024-01-15T11:02:00Z',
      },
      {
        rationale_id: 'rat_004',
        recommendation_id: 'rec_001',
        basis_data: '過去事例D',
        confidentScore: 0.30,
        created_at: '2024-01-15T11:03:00Z',
      },
    ];

    mockAIRecommendationEngine.explainRecommendationReasoning.mockReturnValue(
      reverseOrderedRationales
    );

    const result = visualizeRecommendationRationale(
      {
        recommendation_id: 'rec_001',
        customer_id: 'cust_001',
        proposal_approach: 'アプローチA',
      },
      mockAIRecommendationEngine
    );

    expect(result).toHaveLength(4);
    expect(result[0].confidentScore).toBe(0.30);
    expect(result[1].confidentScore).toBe(0.55);
    expect(result[2].confidentScore).toBe(0.75);
    expect(result[3].confidentScore).toBe(0.95);

    expect(result[0].basis_data).toBe('過去事例D');
    expect(result[1].basis_data).toBe('過去事例C');
    expect(result[2].basis_data).toBe('過去事例B');
    expect(result[3].basis_data).toBe('過去事例A');
  });
});