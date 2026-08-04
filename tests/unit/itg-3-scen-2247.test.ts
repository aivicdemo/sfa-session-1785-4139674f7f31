import { recordRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2247
  test('推奨履歴記録機能 - 推奨根拠が推奨履歴に紐付けられて記録される', async () => {
    const customer_id = 'CUST-001';
    const deal_id = 'DEAL-12345';
    const recommendation_content = '顧客A向けソリューション提案パッケージX';
    const reasoning_explanation = '過去3件の類似案件でパッケージXの採用率が85%であり、ROI改善効果が平均28%';
    const expected_recommendation_id = 'DEAL-12345-REC-001';

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: recommendation_content,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: reasoning_explanation,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const mockDatabase = {
      insert: jest.fn().mockResolvedValue({
        recommendation_id: expected_recommendation_id,
        customer_id,
        deal_id,
        recommendation_content,
        reasoning_explanation,
      }),
      query: jest.fn().mockResolvedValue([
        {
          recommendation_id: expected_recommendation_id,
          customer_id,
          deal_id,
          recommendation_content,
          reasoning_explanation,
          reasoning_id: 'DEAL-12345-REASON-001',
          created_at: '2024-01-15T11:00:00Z',
        },
      ]),
    };

    const result = await recordRecommendation(
      {
        customer_id,
        deal_id,
        recommendation_content,
      },
      mockAIRecommendationEngine,
      mockDatabase
    );

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith({
      customer_id,
      deal_id,
      recommendation_content,
    });

    expect(mockDatabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_id,
        deal_id,
        recommendation_content,
        reasoning_explanation,
      })
    );

    const queryResult = await mockDatabase.query({
      deal_id,
    });

    expect(queryResult).toHaveLength(1);
    expect(queryResult[0]).toMatchObject({
      recommendation_id: expected_recommendation_id,
      customer_id,
      deal_id,
      recommendation_content,
      reasoning_explanation,
    });

    expect(queryResult[0].recommendation_id).toBe(expected_recommendation_id);
    expect(queryResult[0].reasoning_explanation).toBe(reasoning_explanation);
    expect(queryResult[0].reasoning_id).toBeDefined();
    expect(typeof queryResult[0].reasoning_id).toBe('string');

    expect(result).toMatchObject({
      recommendation_id: expected_recommendation_id,
      customer_id,
      deal_id,
      recommendation_content,
      reasoning_explanation,
      success: true,
    });
  });
});