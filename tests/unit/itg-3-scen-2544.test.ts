import { generateSuccessPatternTemplate } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能 - テンプレート生成', () => {
  // SCEN-2544
  test('成功パターンテンプレート生成日が年度の開始日のとき、テンプレートに記録される', () => {
    const fiscal_year_start = new Date('2026-04-01T00:00:00Z');
    const customer_id = 'CUST_20260401_001';
    const customer_name = '株式会社テスト';
    const industry = '製造業';
    const scale = 'large';
    const business_issue = '生産効率向上';
    const deal_stage = 'proposal_phase';
    const deal_value_estimated = 5000000;

    const stub_ai_engine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          success_pattern_id: 'PAT_001',
          customer_industry: '製造業',
          customer_scale: 'large',
          proposal_approach: 'efficiency_focus',
          success_rate: 0.85,
          win_factor: '生産最適化',
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        pattern_id: 'PAT_001',
        relevance_score: 87,
        applicable: true,
      }),
    };

    const request_input = {
      customer_id,
      customer_name,
      industry,
      scale,
      business_issue,
      deal_stage,
      deal_value_estimated,
      current_datetime: fiscal_year_start,
    };

    const result = generateSuccessPatternTemplate(request_input, stub_ai_engine);

    expect(result).toHaveProperty('generated_datetime');
    expect(result.generated_datetime).toBe('2026-04-01T00:00:00Z');
    expect(result).toHaveProperty('template_id');
    expect(result).toHaveProperty('customer_id', customer_id);
    expect(result).toHaveProperty('industry', industry);
    expect(result).toHaveProperty('scale', scale);
    expect(result).toHaveProperty('recommended_patterns');
    expect(Array.isArray(result.recommended_patterns)).toBe(true);
  });
});