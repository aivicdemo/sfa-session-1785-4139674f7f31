import { calculateRecommendationScoreOnAIFailure } from '../../src/logic/it-1-br-3-3-2-1';

describe('AI推奨失敗時の代替パターンマスタからのスコア算出', () => {
  // SCEN-1738: [edge] 推奨妥当性スコア算出機能 - AIエージェント推奨が失敗したとき代替パターンマスタから推奨スコアを計算する
  test('AIRecommendationEngine呼び出し失敗時にパターンマスタから最高成功率パターンを選出し、統計情報に基づくスコアを返却する', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(new Error('429 Rate Limit')),
    };

    const recommendationPatternMaster = [
      {
        pattern_id: 'PAT_A',
        pattern_name: 'パターンA',
        success_rate: 0.85,
        total_cases: 100,
        applicable_industries: ['IT', '製造'],
        applicable_deal_stages: ['提案', '商談中'],
      },
      {
        pattern_id: 'PAT_B',
        pattern_name: 'パターンB',
        success_rate: 0.78,
        total_cases: 95,
        applicable_industries: ['IT'],
        applicable_deal_stages: ['提案'],
      },
      {
        pattern_id: 'PAT_C',
        pattern_name: 'パターンC',
        success_rate: 0.72,
        total_cases: 88,
        applicable_industries: ['製造', '流通'],
        applicable_deal_stages: ['商談中'],
      },
    ];

    const newDealInput = {
      customer_industry: 'IT',
      deal_amount: 5000000,
      deal_stage: '提案',
      customer_size: '大企業',
      sales_owner_experience_level: 'junior',
    };

    const result = await calculateRecommendationScoreOnAIFailure(
      newDealInput,
      recommendationPatternMaster,
      mockAIEngine,
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(result.recommended_pattern_id).toBe('PAT_A');
    expect(result.recommended_pattern_name).toBe('パターンA');
    expect(result.recommendation_score).toBe(0.85);
    expect(result.confidence_level).toBe('HIGH');
    expect(result.is_fallback_pattern).toBe(true);
    expect(result.reasoning_summary).toBe('過去の成功パターンから推奨');
    expect(result.fallback_reason).toBe('外部AI呼び出し失敗');
  });
});