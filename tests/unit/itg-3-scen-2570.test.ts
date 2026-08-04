import { generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2570
  test('複数の推奨内容に同じ根拠が紐付いているとき、それぞれに表示される', async () => {
    const customer_id = 'CUST-12345';
    const deal_conditions = {
      industry: '製造業',
      company_size: '中堅企業',
      current_challenges: ['生産効率化', 'コスト削減'],
    };

    const mock_recommendation_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            recommendation_id: 'REC-001',
            content: '顧客の課題解決型アプローチ',
            reason_ids: ['REASON-A'],
            confidence_score: 85,
          },
          {
            recommendation_id: 'REC-002',
            content: '段階的導入プラン提案',
            reason_ids: ['REASON-A'],
            confidence_score: 82,
          },
          {
            recommendation_id: 'REC-003',
            content: 'カスタマイズソリューション',
            reason_ids: ['REASON-A'],
            confidence_score: 80,
          },
        ],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reason_id: 'REASON-A',
        explanation:
          '対象顧客と類似した業界背景を持つ3社の成功事例から、導入後平均ROI向上率35%を実現した共通アプローチです',
      }),
    };

    const result = await generateRecommendation(
      customer_id,
      deal_conditions,
      mock_recommendation_engine
    );

    expect(result.recommendations).toHaveLength(3);

    expect(result.recommendations[0]).toEqual({
      recommendation_id: 'REC-001',
      content: '顧客の課題解決型アプローチ',
      reason_ids: ['REASON-A'],
      confidence_score: 85,
    });

    expect(result.recommendations[1]).toEqual({
      recommendation_id: 'REC-002',
      content: '段階的導入プラン提案',
      reason_ids: ['REASON-A'],
      confidence_score: 82,
    });

    expect(result.recommendations[2]).toEqual({
      recommendation_id: 'REC-003',
      content: 'カスタマイズソリューション',
      reason_ids: ['REASON-A'],
      confidence_score: 80,
    });

    const reasoning_result_1 = await explainRecommendationReasoning(
      'REASON-A',
      mock_recommendation_engine
    );

    expect(reasoning_result_1).toEqual({
      reason_id: 'REASON-A',
      explanation:
        '対象顧客と類似した業界背景を持つ3社の成功事例から、導入後平均ROI向上率35%を実現した共通アプローチです',
    });

    const reasoning_result_2 = await explainRecommendationReasoning(
      'REASON-A',
      mock_recommendation_engine
    );

    expect(reasoning_result_2).toEqual({
      reason_id: 'REASON-A',
      explanation:
        '対象顧客と類似した業界背景を持つ3社の成功事例から、導入後平均ROI向上率35%を実現した共通アプローチです',
    });

    const reasoning_result_3 = await explainRecommendationReasoning(
      'REASON-A',
      mock_recommendation_engine
    );

    expect(reasoning_result_3).toEqual({
      reason_id: 'REASON-A',
      explanation:
        '対象顧客と類似した業界背景を持つ3社の成功事例から、導入後平均ROI向上率35%を実現した共通アプローチです',
    });

    expect(mock_recommendation_engine.generateRecommendation).toHaveBeenCalledWith(
      customer_id,
      deal_conditions
    );

    expect(mock_recommendation_engine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
    expect(mock_recommendation_engine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      1,
      'REASON-A'
    );
    expect(mock_recommendation_engine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      2,
      'REASON-A'
    );
    expect(mock_recommendation_engine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      3,
      'REASON-A'
    );

    for (const recommendation of result.recommendations) {
      expect(recommendation.reason_ids).toContain('REASON-A');
      expect(recommendation.reason_ids).toHaveLength(1);
    }
  });
});