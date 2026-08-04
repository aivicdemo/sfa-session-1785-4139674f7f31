import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1741: [edge] 推奨根拠の可視化機能 - 根拠が1件のとき根拠リストに1要素を含めて返す
  test('should return recommendation reasoning with single reason element', async () => {
    const test_recommendation_id = 'REC-20240115-001';

    const mock_ai_engine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        recommendationId: test_recommendation_id,
        reasonList: [
          {
            reasonId: 'R001',
            description: '過去商談での成功事例',
            relevanceScore: 0.92
          }
        ]
      })
    };

    const result = await explainRecommendationReasoning(
      test_recommendation_id,
      mock_ai_engine
    );

    expect(result.reasonList).toHaveLength(1);
    expect(result.reasonList[0]).toEqual({
      reasonId: 'R001',
      description: '過去商談での成功事例',
      relevanceScore: 0.92
    });
    expect(result.reasonList[0].reasonId).toBe('R001');
    expect(result.reasonList[0].description).toBe('過去商談での成功事例');
    expect(result.reasonList[0].relevanceScore).toBe(0.92);
  });
});