import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン照合機能 - 同一条件での一貫性検証', () => {
  test('SCEN-911: 同一の新規案件条件で2回照合を実行しても同じ結果が返される', () => {
    const new_deal_condition = {
      customer_industry: '製造業',
      budget_scale_jpy: 50000000,
      implementation_deadline_months: 3,
      primary_challenge: '生産効率化',
    };

    const mock_ai_engine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const expected_patterns_1st = [
      {
        pattern_id: 'SP-2847',
        pattern_name: '食品製造業向け生産効率化提案',
        score: 0.9234,
      },
      {
        pattern_id: 'SP-1956',
        pattern_name: '中堅製造業向けDX推進提案',
        score: 0.8876,
      },
    ];

    const expected_reasoning =
      '御社の生産効率化ニーズと同じ課題を抱えていた過去3件の商談で全て成約に至っており、同様のアプローチが有効と判断されます。';

    const mock_recommendation_result = {
      pattern_ids: ['SP-2847', 'SP-1956'],
      recommendation_patterns: expected_patterns_1st,
      score_list: [0.9234, 0.8876],
      reasoning_text: expected_reasoning,
      timestamp: new Date('2024-01-15T10:00:00Z'),
    };

    mock_ai_engine.generateRecommendation.mockReturnValue(
      mock_recommendation_result
    );
    mock_ai_engine.explainRecommendationReasoning.mockReturnValue(
      expected_reasoning
    );

    const result_1st = generateRecommendation(new_deal_condition, mock_ai_engine);

    const result_2nd = generateRecommendation(new_deal_condition, mock_ai_engine);

    expect(result_1st.pattern_ids).toEqual(result_2nd.pattern_ids);
    expect(result_1st.pattern_ids).toEqual(['SP-2847', 'SP-1956']);

    expect(result_1st.score_list).toEqual(result_2nd.score_list);
    expect(result_1st.score_list).toEqual([0.9234, 0.8876]);

    expect(result_1st.recommendation_patterns).toEqual(
      result_2nd.recommendation_patterns
    );
    expect(result_1st.recommendation_patterns).toEqual(expected_patterns_1st);

    expect(result_1st.reasoning_text).toEqual(result_2nd.reasoning_text);
    expect(result_1st.reasoning_text).toBe(expected_reasoning);

    expect(mock_ai_engine.generateRecommendation).toHaveBeenCalledTimes(2);
    expect(mock_ai_engine.generateRecommendation).toHaveBeenCalledWith(
      new_deal_condition,
      mock_ai_engine
    );
  });
});