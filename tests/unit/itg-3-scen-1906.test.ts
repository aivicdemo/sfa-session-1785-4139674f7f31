import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1906
  test('成功パターンが欠落しているときに推奨根拠の生成がスキップされる', () => {
    const customer_id = 'CUST-20240115-001';
    const deal_conditions = {
      industry: '製造業',
      company_size: '従業員500人',
      challenge: '生産効率化',
      budget: 5000000,
      timeline_months: 6,
    };
    const case_type = 'initial_proposal';

    const mock_ai_engine = {
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      generateRecommendation: jest.fn().mockReturnValue({
        recommendation_id: 'REC-20240115-001',
        customer_id: customer_id,
        approach: 'cost_optimization',
        confidence_score: 0,
        reasoning_explanation: null,
        detailed_reasoning: null,
        reasoning_skipped: true,
      }),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = generateRecommendationWithReasoning(
      customer_id,
      deal_conditions,
      case_type,
      mock_ai_engine,
    );

    expect(mock_ai_engine.findSimilarPatterns).toHaveBeenCalledWith(
      customer_id,
      deal_conditions,
      case_type,
    );
    expect(mock_ai_engine.findSimilarPatterns).toHaveBeenCalledTimes(1);

    expect(mock_ai_engine.explainRecommendationReasoning).not.toHaveBeenCalled();

    expect(result.recommendation_id).toBe('REC-20240115-001');
    expect(result.customer_id).toBe(customer_id);
    expect(result.reasoning_explanation).toBeNull();
    expect(result.detailed_reasoning).toBeNull();
    expect(result.reasoning_skipped).toBe(true);
  });
});