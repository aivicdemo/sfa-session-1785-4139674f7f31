import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1790
  test('推奨根拠の可視化機能 - 根拠データに顧客IDが正確に含まれる', () => {
    const customer_id = 'CUST-001234';
    const business_condition = '大規模システム導入';
    const budget_amount = '5000万円';

    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendation_content: '大規模システム導入に適した提案アプローチ',
        reasoning_basis: {
          customer_id: customer_id,
          past_success_patterns: [
            {
              pattern_id: 'PAT-001',
              similarity_score: 95,
              customer_id: customer_id,
            },
          ],
          customer_attributes: {
            customer_id: customer_id,
            industry: '金融',
            scale: '大規模企業',
          },
          timing_analysis: {
            recommended_action_timing: '即時対応',
            purchase_signal_strength: 85,
          },
        },
        confidence_score: 88,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input_data = {
      customer_id: customer_id,
      business_condition: business_condition,
      budget: budget_amount,
    };

    const result = generateRecommendationWithReasoning(
      input_data,
      mock_ai_engine
    );

    expect(result.reasoning_basis.customer_id).toBe('CUST-001234');
    expect(result.reasoning_basis.customer_attributes.customer_id).toBe(
      'CUST-001234'
    );
    expect(result.reasoning_basis.past_success_patterns[0].customer_id).toBe(
      'CUST-001234'
    );

    const all_customer_ids = [
      result.reasoning_basis.customer_id,
      result.reasoning_basis.customer_attributes.customer_id,
      result.reasoning_basis.past_success_patterns[0].customer_id,
    ];
    const unique_customer_ids = new Set(all_customer_ids);
    expect(unique_customer_ids.size).toBe(1);

    const matching_customer_ids = all_customer_ids.filter(
      (id) => id === 'CUST-001234'
    );
    expect(matching_customer_ids.length).toBe(3);

    expect(result.confidence_score).toBe(88);
  });
});