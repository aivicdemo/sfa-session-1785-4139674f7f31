import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - AIエージェント推奨支援', () => {
  // SCEN-2269
  test('AIRecommendationEngineの外部API呼び出しが失敗したとき、内部推奨パターンマスタからの代替取得に切り替わる', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValueOnce(
        new Error('Network timeout')
      ).mockRejectedValueOnce(
        new Error('Network timeout')
      ).mockRejectedValueOnce(
        new Error('Network timeout')
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const mockPatternMaster = [
      {
        pattern_id: 'PAT-001',
        industry: 'manufacturing',
        company_size: 'large',
        win_rate: 0.82,
        approach: 'Long-term partnership strategy with ROI focus',
        sample_count: 45
      },
      {
        pattern_id: 'PAT-002',
        industry: 'manufacturing',
        company_size: 'large',
        win_rate: 0.78,
        approach: 'Quick implementation with cost optimization',
        sample_count: 32
      },
      {
        pattern_id: 'PAT-003',
        industry: 'retail',
        company_size: 'medium',
        win_rate: 0.75,
        approach: 'Digital transformation enablement',
        sample_count: 28
      }
    ];

    const inputCondition = {
      customer_id: 'CUST-12345',
      industry: 'manufacturing',
      company_size: 'large',
      annual_revenue: 50000000,
      current_challenges: ['cost_reduction', 'efficiency_improvement'],
      budget_range: [500000, 1000000],
      decision_timeline_days: 90
    };

    const result = await generateRecommendation(
      inputCondition,
      mockAIEngine,
      mockPatternMaster
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(result.source_type).toBe('internal_master');
    expect(result.explanation_type).toBe('simplified');
    expect(result.pattern_id).toBe('PAT-001');
    expect(result.recommended_approach).toBe('Long-term partnership strategy with ROI focus');
    expect(result.win_rate).toBe(0.82);
    expect(result.fallback_flag).toBe(true);
    expect(result.simplified_reasoning).toBeDefined();
    expect(typeof result.simplified_reasoning).toBe('string');
    expect(result.simplified_reasoning.length).toBeGreaterThan(0);
    expect(result.simplified_reasoning.length).toBeLessThan(200);
  });
});