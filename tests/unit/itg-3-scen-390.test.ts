import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度検証機能', () => {
  // SCEN-390
  test('推奨内容と実際の結果が一致したレコードが0件のとき、適中率0%として計測', () => {
    const testDataset = [
      {
        recommendationId: 'rec-001',
        recommended_approach: 'approach_A',
        actual_approach: 'approach_B',
        matched: false,
      },
      {
        recommendationId: 'rec-002',
        recommended_approach: 'approach_C',
        actual_approach: 'approach_D',
        matched: false,
      },
      {
        recommendationId: 'rec-003',
        recommended_approach: 'approach_E',
        actual_approach: 'approach_F',
        matched: false,
      },
    ];

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    aiRecommendationEngineStub.findSimilarPatterns.mockResolvedValue(
      testDataset.filter((record) => !record.matched),
    );

    const result = calculateInferenceAccuracy(testDataset, aiRecommendationEngineStub);

    expect(result.accuracy).toBe(0);
    expect(result.matchCount).toBe(0);
    expect(result.totalCount).toBe(3);
    expect(typeof result.accuracy).toBe('number');
  });
});