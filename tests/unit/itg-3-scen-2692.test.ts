import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨ロジックの外部サービス呼び出し失敗時の代替処理', () => {
  test('SCEN-2692: OpenAI API呼び出し失敗時に推奨パターンマスタから統計的上位パターンを返却', async () => {
    const failingAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(new Error('OpenAI API timeout')),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationPatternMaster = [
      {
        pattern_id: 'PAT-001',
        approach_content: '経営層向けROI重視提案',
        customer_segment: '製造業',
        deal_stage: '初期段階',
        success_rate: 0.87,
        applied_count: 62,
        is_active: true,
      },
      {
        pattern_id: 'PAT-002',
        approach_content: '導入期間短縮型提案',
        customer_segment: '製造業',
        deal_stage: '初期段階',
        success_rate: 0.81,
        applied_count: 48,
        is_active: true,
      },
      {
        pattern_id: 'PAT-003',
        approach_content: '段階的導入提案',
        customer_segment: '製造業',
        deal_stage: '初期段階',
        success_rate: 0.75,
        applied_count: 35,
        is_active: true,
      },
    ];

    const newDealCondition = {
      customer_industry: '製造業',
      deal_size_jpy: 10000000,
      decision_maker_level: '経営層',
      deal_stage: '初期段階',
    };

    const result = await generateRecommendation(
      newDealCondition,
      recommendationPatternMaster,
      failingAIEngine,
    );

    expect(result).toEqual({
      recommendation_pattern_id: 'PAT-001',
      recommended_approach: '経営層向けROI重視提案',
      success_rate: 0.87,
      applied_count: 62,
      reasoning: '過去の同様案件で高い成功率を記録したパターンです',
      source: 'pattern_master_fallback',
      ai_engine_failed: true,
    });

    expect(failingAIEngine.generateRecommendation).toHaveBeenCalledWith(
      newDealCondition,
    );
    expect(failingAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
  });
});