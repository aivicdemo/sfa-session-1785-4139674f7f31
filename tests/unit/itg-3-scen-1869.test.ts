import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1869
  test('推奨内容の根拠表示機能 - 根拠の適用可能性スコアが100を超えるとき根拠表示に失敗する', () => {
    const invalid_recommendation_data = {
      customer_id: 'CUST-001',
      deal_id: 'DEAL-2024-0001',
      recommendation_content: '提案アプローチ: 顧客の経営課題に基づいたソリューション提案',
      pattern_relevance_score: 101,
      success_pattern_data: {
        pattern_id: 'PAT-SUCCESS-001',
        customer_industry: '製造業',
        customer_size: '大企業',
        success_factors: ['迅速な初期ヒアリング', '経営層への段階的説得'],
        deal_amount: 5000000,
        deal_duration_days: 90
      },
      supporting_evidence: [
        {
          evidence_id: 'EV-001',
          evidence_type: 'past_case',
          case_name: '類似案件A',
          match_degree: 0.92
        }
      ],
      generated_timestamp: '2024-01-15T14:30:00Z'
    };

    const stub_ai_recommendation_engine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(101)
    };

    expect(() =>
      explainRecommendationReasoning(
        invalid_recommendation_data,
        stub_ai_recommendation_engine
      )
    ).toThrow(/適用可能性スコア/);
  });
});