import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-893
  test('推奨根拠データの提示機能 - explainRecommendationReasoning が失敗したとき簡略版の根拠説明が代替表示される', async () => {
    const customer_input = {
      industry: 'IT',
      scale_jpy: 5000000,
      decision_maker_count: 3,
    };

    const similar_patterns_result = {
      patterns: [
        {
          pattern_id: 'pat_001',
          approach_name: '導入事例重視',
          success_rate: 0.75,
          historical_count: 120,
        },
        {
          pattern_id: 'pat_002',
          approach_name: 'ROI最適化',
          success_rate: 0.68,
          historical_count: 95,
        },
      ],
    };

    const ai_recommendation_result = {
      recommendation_id: 'rec_001',
      approach: '導入事例重視',
      confidence_score: 85,
    };

    const failing_ai_engine = {
      explainRecommendationReasoning: jest.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('API timeout'));
          }, 35000);
        });
      }),
      generateRecommendation: jest.fn().mockResolvedValue(ai_recommendation_result),
      findSimilarPatterns: jest.fn().mockResolvedValue(similar_patterns_result),
      evaluatePatternRelevance: jest.fn(),
    };

    const max_retry_attempts = 3;
    const retry_delays_ms = [1000, 2000, 4000];
    const timeout_ms = 30000;

    let retry_attempt_count = 0;
    const actual_result = await explainRecommendationReasoning(
      customer_input,
      ai_recommendation_result,
      similar_patterns_result,
      failing_ai_engine,
      {
        max_retries: max_retry_attempts,
        retry_delays: retry_delays_ms,
        timeout: timeout_ms,
      }
    );

    expect(failing_ai_engine.explainRecommendationReasoning).toHaveBeenCalled();

    expect(actual_result.recommendation_id).toBe('rec_001');
    expect(actual_result.approach).toBe('導入事例重視');
    expect(actual_result.confidence_score).toBe(85);

    expect(actual_result.reasoning).toBeDefined();
    expect(actual_result.reasoning.type).toBe('simplified');

    expect(actual_result.reasoning.simplified_reason).toBeDefined();
    expect(actual_result.reasoning.simplified_reason.length).toBeGreaterThan(0);

    const expected_top_pattern = similar_patterns_result.patterns[0];
    expect(actual_result.reasoning.simplified_reason).toContain(
      expected_top_pattern.approach_name
    );
    expect(actual_result.reasoning.simplified_reason).toContain(
      String(Math.round(expected_top_pattern.success_rate * 100))
    );

    expect(actual_result.reasoning.detailed_explanation).toBeUndefined();

    expect(actual_result.error_message).toBeUndefined();

    expect(actual_result.is_fallback_applied).toBe(true);
  });
});