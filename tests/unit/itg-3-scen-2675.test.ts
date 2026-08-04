import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2675
  test('適用成功パターンが複数件のとき、複数件すべての根拠が優先度順に営業担当者向けに出力される', () => {
    const similar_pattern_1 = {
      pattern_id: 'pat_001',
      customer_industry: 'IT',
      success_rate: 0.92,
      relevance_score: 0.95,
    };

    const similar_pattern_2 = {
      pattern_id: 'pat_002',
      contract_size: 5000000,
      contract_success_rate: 0.88,
      relevance_score: 0.87,
    };

    const similar_pattern_3 = {
      pattern_id: 'pat_003',
      implementation_period_months: 3,
      customer_satisfaction: 0.85,
      relevance_score: 0.76,
    };

    const stub_ai_recommendation_engine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        similar_pattern_1,
        similar_pattern_2,
        similar_pattern_3,
      ]),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((pattern) => {
          if (pattern.pattern_id === 'pat_001') return Promise.resolve(0.95);
          if (pattern.pattern_id === 'pat_002') return Promise.resolve(0.87);
          if (pattern.pattern_id === 'pat_003') return Promise.resolve(0.76);
          return Promise.resolve(0);
        }),
      explainRecommendationReasoning: jest
        .fn()
        .mockImplementation((pattern) => {
          if (pattern.pattern_id === 'pat_001')
            return Promise.resolve('顧客業界がIT・金融で過去成功率92%');
          if (pattern.pattern_id === 'pat_002')
            return Promise.resolve('契約規模500万以上で成約率88%');
          if (pattern.pattern_id === 'pat_003')
            return Promise.resolve('導入期間3ヶ月以内の案件で顧客満足度85%');
          return Promise.resolve('');
        }),
    };

    const new_opportunity = {
      customer_industry: 'IT',
      contract_size: 6000000,
      implementation_period_months: 2,
    };

    return visualizeRecommendationReasoning(
      new_opportunity,
      stub_ai_recommendation_engine,
    ).then((result) => {
      expect(result).toEqual({
        reasoning_list: [
          {
            priority_rank: 1,
            pattern_id: 'pat_001',
            relevance_score: 0.95,
            explanation_text: '顧客業界がIT・金融で過去成功率92%',
          },
          {
            priority_rank: 2,
            pattern_id: 'pat_002',
            relevance_score: 0.87,
            explanation_text: '契約規模500万以上で成約率88%',
          },
          {
            priority_rank: 3,
            pattern_id: 'pat_003',
            relevance_score: 0.76,
            explanation_text: '導入期間3ヶ月以内の案件で顧客満足度85%',
          },
        ],
        display_status: 'success',
      });
    });
  });
});