import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨機能 - OpenAI API タイムアウト時の内部マスタ代替', () => {
  // SCEN-670
  test('OpenAI API呼び出しが30秒超過時にタイムアウトし、内部推奨パターンマスタから簡略版を返却する', async () => {
    const input_customer_info = {
      customer_id: 'CUST-20240115-001',
      industry: '製造業',
      company_size: '中堅企業（501～1000名）',
      annual_revenue: '50億円',
      business_challenge: '生産効率化',
    };

    const input_deal_conditions = {
      deal_id: 'DEAL-20240115-001',
      product_category: 'ERP導入',
      estimated_contract_value: '2000万円',
      deal_stage: '初期提案',
      customer_pain_points: ['コスト最適化', '業務効率化'],
    };

    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockImplementation(
        () => new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              recommendation_id: 'REC-AI-001',
              pattern_id: 'PAT-AI-001',
              approach: 'AI推奨提案',
              confidence_score: 85,
              reasoning: 'OpenAI分析結果',
              recommendation_source: 'openai_api',
            });
          }, 31000);
        })
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const expected_internal_patterns = [
      {
        pattern_id: 'PAT-INT-001',
        industry: '製造業',
        company_size: '中堅企業（501～1000名）',
        success_count: 12,
        success_rate: 92,
        recommended_approach: 'フェーズ分割導入',
        average_contract_value: '1800万円',
      },
      {
        pattern_id: 'PAT-INT-002',
        industry: '製造業',
        company_size: '中堅企業（501～1000名）',
        success_count: 9,
        success_rate: 88,
        recommended_approach: '保守・改善パッケージ提案',
        average_contract_value: '800万円',
      },
      {
        pattern_id: 'PAT-INT-003',
        industry: '製造業',
        company_size: '中堅企業（501～1000名）',
        success_count: 7,
        success_rate: 85,
        recommended_approach: '従量課金モデル提案',
        average_contract_value: '500万円',
      },
    ];

    const result = await generateRecommendation(
      input_customer_info,
      input_deal_conditions,
      mock_ai_engine,
      30000
    );

    expect(result.recommendation_source).toBe('internal_master');
    expect(result.timeout_reason).toBe('OpenAI API 30秒超過');
    expect(result.recommended_patterns).toHaveLength(3);

    expect(result.recommended_patterns[0]).toEqual(
      expect.objectContaining({
        pattern_id: 'PAT-INT-001',
        industry: '製造業',
        company_size: '中堅企業（501～1000名）',
        success_count: 12,
        success_rate: 92,
        recommended_approach: 'フェーズ分割導入',
      })
    );

    expect(result.recommended_patterns[1]).toEqual(
      expect.objectContaining({
        pattern_id: 'PAT-INT-002',
        industry: '製造業',
        company_size: '中堅企業（501～1000名）',
        success_count: 9,
        success_rate: 88,
        recommended_approach: '保守・改善パッケージ提案',
      })
    );

    expect(result.recommended_patterns[2]).toEqual(
      expect.objectContaining({
        pattern_id: 'PAT-INT-003',
        industry: '製造業',
        company_size: '中堅企業（501～1000名）',
        success_count: 7,
        success_rate: 85,
        recommended_approach: '従量課金モデル提案',
      })
    );

    expect(result.reasoning_summary).toBe('統計的に最も成功率が高いパターンです');
    expect(result.is_simplified_version).toBe(true);
    expect(result.metadata).toEqual(
      expect.objectContaining({
        recommendation_source: 'internal_master',
        timeout_reason: 'OpenAI API 30秒超過',
        fallback_triggered_at: expect.any(String),
        is_displayable: true,
      })
    );
  });
});