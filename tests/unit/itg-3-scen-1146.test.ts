import { explainRecommendationReasoningWithFallback } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1146
  test('should return simplified reasoning and fallback message when AI engine fails', async () => {
    const mock_recommendation_id = 'REC-20240115-001';
    const mock_customer_id = 'CUST-2024-0542';
    const mock_industry = 'Manufacturing';
    const mock_proposal_content = 'ERP System Implementation';

    const mock_ai_engine_stub = {
      explainRecommendationReasoning: async () => {
        throw new Error('API timeout exceeded');
      },
    };

    const mock_recommendation_pattern_master = [
      {
        rank: 1,
        industry: 'Manufacturing',
        proposal_content: 'ERP System Implementation',
        success_count: 24,
        pattern_id: 'PAT-001',
      },
      {
        rank: 2,
        industry: 'Manufacturing',
        proposal_content: 'Supply Chain Optimization',
        success_count: 18,
        pattern_id: 'PAT-002',
      },
      {
        rank: 3,
        industry: 'Manufacturing',
        proposal_content: 'Cost Reduction Strategy',
        success_count: 15,
        pattern_id: 'PAT-003',
      },
    ];

    const result = await explainRecommendationReasoningWithFallback(
      mock_recommendation_id,
      mock_customer_id,
      mock_industry,
      mock_proposal_content,
      mock_ai_engine_stub,
      mock_recommendation_pattern_master
    );

    expect(result.user_facing_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    expect(result.reasoning_text).toContain('顧客業種：Manufacturing');
    expect(result.reasoning_text).toContain('提案内容：ERP System Implementation');
    expect(result.reasoning_text).toContain('成功実績：24件');

    expect(result.fallback_patterns).toHaveLength(3);
    expect(result.fallback_patterns[0].rank).toBe(1);
    expect(result.fallback_patterns[0].success_count).toBe(24);
    expect(result.fallback_patterns[1].rank).toBe(2);
    expect(result.fallback_patterns[1].success_count).toBe(18);
    expect(result.fallback_patterns[2].rank).toBe(3);
    expect(result.fallback_patterns[2].success_count).toBe(15);

    expect(result.reasoning_text.length).toBeLessThan(500);

    expect(result.is_fallback).toBe(true);
  });
});