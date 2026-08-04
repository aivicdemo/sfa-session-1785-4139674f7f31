import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1378
  test('evaluatePatternRelevance が失敗したとき、キャッシュされた過去推奨と統計的上位パターンを代替表示', async () => {
    const failed_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposals: [
          {
            approach_id: 'APP-001',
            description: 'Direct sales approach',
            relevance_score: undefined,
          },
        ],
        message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          pattern_id: 'PAT-001',
          success_rate: 0.85,
          rank: 1,
        },
        {
          pattern_id: 'PAT-002',
          success_rate: 0.78,
          rank: 2,
        },
        {
          pattern_id: 'PAT-003',
          success_rate: 0.72,
          rank: 3,
        },
      ]),
      evaluatePatternRelevance: jest
        .fn()
        .mockRejectedValue(new Error('API timeout')),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reason: '過去の類似案件の上位パターンから推奨',
        simplified: true,
      }),
    };

    const new_deal_condition = {
      customer_industry: 'technology',
      customer_size: 'large',
      deal_amount_range: 'over_1M',
      decision_maker_role: 'CTO',
      contract_timeline: '90_days',
    };

    const cached_recommendations = [
      {
        deal_id: 'DEAL-OLD-001',
        pattern_id: 'PAT-001',
        proposal_type: 'comprehensive_consulting',
        success: true,
      },
      {
        deal_id: 'DEAL-OLD-002',
        pattern_id: 'PAT-002',
        proposal_type: 'phased_implementation',
        success: true,
      },
    ];

    const pattern_master = [
      {
        pattern_id: 'PAT-001',
        description: 'Direct CTO engagement with ROI calculator',
        historical_close_rate: 0.85,
        avg_deal_size: 2500000,
        industry_applicability: ['technology', 'financial_services'],
      },
      {
        pattern_id: 'PAT-002',
        description: 'Phased approach with executive sponsor',
        historical_close_rate: 0.78,
        avg_deal_size: 1800000,
        industry_applicability: ['technology', 'healthcare'],
      },
      {
        pattern_id: 'PAT-003',
        description: 'Competitive displacement strategy',
        historical_close_rate: 0.72,
        avg_deal_size: 1500000,
        industry_applicability: ['technology', 'retail'],
      },
    ];

    const result = await generateRecommendation(
      new_deal_condition,
      failed_engine,
      cached_recommendations,
      pattern_master,
    );

    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
    );

    expect(result.proposals).toHaveLength(3);

    expect(result.proposals[0]).toEqual({
      pattern_id: 'PAT-001',
      description: 'Direct CTO engagement with ROI calculator',
      relevance_score: undefined,
      fallback_rank: 1,
      historical_close_rate: 0.85,
    });

    expect(result.proposals[1]).toEqual({
      pattern_id: 'PAT-002',
      description: 'Phased approach with executive sponsor',
      relevance_score: undefined,
      fallback_rank: 2,
      historical_close_rate: 0.78,
    });

    expect(result.proposals[2]).toEqual({
      pattern_id: 'PAT-003',
      description: 'Competitive displacement strategy',
      relevance_score: undefined,
      fallback_rank: 3,
      historical_close_rate: 0.72,
    });

    expect(result.reasoning).toEqual({
      reason: '過去の類似案件の上位パターンから推奨',
      simplified: true,
    });

    expect(result.fallback_applied).toBe(true);
  });
});