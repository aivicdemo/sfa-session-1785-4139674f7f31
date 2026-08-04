import { generateRecommendationWithPatternWeighting } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2821
  test('成功パターン抽出・重み付けロジック - 過去商談データが業務上の最大規模(10000件)に達するとき、重み付けルール生成が完了する', async () => {
    const mock_ai_engine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mock_db_adapter = {
      fetchHistoricalDealData: jest.fn().mockResolvedValue(
        Array.from({ length: 10000 }, (_, index) => ({
          deal_id: `deal_${String(index + 1).padStart(5, '0')}`,
          customer_industry: ['manufacturing', 'it', 'finance', 'healthcare', 'retail'][index % 5],
          customer_size: ['large', 'medium', 'small'][index % 3],
          deal_amount: 100000 + (index * 1000),
          deal_stage: ['discovery', 'proposal', 'negotiation', 'closed'][index % 4],
          success_flag: index % 3 !== 0,
          sales_approach: `approach_${(index % 20) + 1}`,
          customer_pain_point: `pain_${(index % 15) + 1}`,
          proposed_solution: `solution_${(index % 12) + 1}`,
          deal_duration_days: 30 + (index % 180),
          deal_date: new Date('2024-01-01T00:00:00Z').toISOString(),
        }))
      ),
      updateRecommendationPatternMaster: jest.fn().mockResolvedValue({
        updated_at: '2024-01-15T11:00:00Z',
        record_count: expect.any(Number),
      }),
    };

    const input_params = {
      ai_engine: mock_ai_engine,
      db_adapter: mock_db_adapter,
      historical_data_size: 10000,
      timeout_seconds: 60,
      min_pattern_count: 10,
      max_pattern_count: 50,
    };

    const start_time = Date.now();
    const result = await generateRecommendationWithPatternWeighting(input_params);
    const elapsed_ms = Date.now() - start_time;

    expect(result).toBeDefined();
    expect(result.weighting_rules).toBeDefined();
    expect(Array.isArray(result.weighting_rules)).toBe(true);
    expect(result.weighting_rules.length).toBeGreaterThanOrEqual(10);
    expect(result.weighting_rules.length).toBeLessThanOrEqual(50);

    result.weighting_rules.forEach((rule) => {
      expect(rule.pattern_id).toBeDefined();
      expect(typeof rule.pattern_id).toBe('string');
      expect(rule.weighting_score).toBeDefined();
      expect(typeof rule.weighting_score).toBe('number');
      expect(rule.weighting_score).toBeGreaterThanOrEqual(0.0);
      expect(rule.weighting_score).toBeLessThanOrEqual(1.0);
      expect(rule.success_count).toBeDefined();
      expect(typeof rule.success_count).toBe('number');
      expect(rule.success_count).toBeGreaterThan(0);
      expect(rule.total_count).toBeDefined();
      expect(typeof rule.total_count).toBe('number');
      expect(rule.total_count).toBeGreaterThanOrEqual(rule.success_count);
      expect(rule.applicable_conditions).toBeDefined();
      expect(Array.isArray(rule.applicable_conditions)).toBe(true);
    });

    expect(result.generation_timestamp).toBeDefined();
    expect(typeof result.generation_timestamp).toBe('string');
    const timestamp_date = new Date(result.generation_timestamp);
    expect(timestamp_date.getTime()).toBeGreaterThan(0);

    expect(result.data_processed_count).toBe(10000);
    expect(result.pattern_extraction_status).toBe('completed');

    expect(elapsed_ms).toBeLessThan(input_params.timeout_seconds * 1000);

    expect(mock_db_adapter.updateRecommendationPatternMaster).toHaveBeenCalledWith(
      expect.objectContaining({
        weighting_rules: expect.any(Array),
        generation_timestamp: expect.any(String),
        processed_deal_count: 10000,
      })
    );

    const update_call_args = mock_db_adapter.updateRecommendationPatternMaster.mock.calls[0][0];
    expect(update_call_args.weighting_rules.length).toBeGreaterThanOrEqual(10);
    expect(update_call_args.weighting_rules.length).toBeLessThanOrEqual(50);

    const success_rate_stats = {
      min_score: Math.min(...result.weighting_rules.map((r) => r.weighting_score)),
      max_score: Math.max(...result.weighting_rules.map((r) => r.weighting_score)),
      avg_score:
        result.weighting_rules.reduce((sum, r) => sum + r.weighting_score, 0) /
        result.weighting_rules.length,
    };

    expect(success_rate_stats.min_score).toBeGreaterThanOrEqual(0.0);
    expect(success_rate_stats.max_score).toBeLessThanOrEqual(1.0);
    expect(success_rate_stats.avg_score).toBeGreaterThan(0.0);
    expect(success_rate_stats.avg_score).toBeLessThan(1.0);

    const pattern_variety = new Set(
      result.weighting_rules.flatMap((rule) =>
        rule.applicable_conditions.map((cond) => JSON.stringify(cond))
      )
    ).size;
    expect(pattern_variety).toBeGreaterThan(1);
  });
});