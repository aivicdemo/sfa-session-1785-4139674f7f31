import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-2228
  test('[normal] 過去商談が1件のとき成功パターンが抽出される', () => {
    const past_deal = {
      deal_id: 'D001',
      customer_industry: '製造業',
      customer_challenge: '生産効率化',
      proposed_approach: '自動化ツール導入',
      result: '成約',
      success: true,
    };

    const similar_patterns_result = [
      {
        deal_id: 'D001',
        similarity_score: 0.85,
        customer_industry: '製造業',
        customer_challenge: '生産効率化',
        proposed_approach: '自動化ツール導入',
        result: '成約',
      },
    ];

    const pattern_relevance_score = 0.78;

    const ai_engine_stub = {
      findSimilarPatterns: jest.fn().mockReturnValue(similar_patterns_result),
      evaluatePatternRelevance: jest.fn().mockReturnValue(pattern_relevance_score),
      generateRecommendation: jest.fn(),
    };

    const new_deal_input = {
      customer_industry: '製造業',
      customer_challenge: '生産効率化',
      deal_stage: '提案前',
    };

    const expected_recommendation = {
      status: 'Success',
      extracted_success_pattern: {
        pattern_count: 1,
        patterns: [
          {
            deal_id: 'D001',
            industry: '製造業',
            challenge: '生産効率化',
            classification: '成功パターン',
            similarity_score: 0.85,
          },
        ],
      },
      proposed_approach: '自動化ツール導入',
      reasoning: '過去1件の同一業種・課題案件で成約実績あり',
      applicability_score: 0.78,
    };

    const result = generateRecommendation(new_deal_input, ai_engine_stub);

    expect(result.status).toBe('Success');
    expect(result.extracted_success_pattern.pattern_count).toBe(1);
    expect(result.extracted_success_pattern.patterns).toHaveLength(1);
    expect(result.extracted_success_pattern.patterns[0].deal_id).toBe('D001');
    expect(result.extracted_success_pattern.patterns[0].classification).toBe(
      '成功パターン'
    );
    expect(result.extracted_success_pattern.patterns[0].similarity_score).toBe(
      0.85
    );
    expect(result.proposed_approach).toBe('自動化ツール導入');
    expect(result.reasoning).toBe('過去1件の同一業種・課題案件で成約実績あり');
    expect(result.applicability_score).toBe(0.78);
    expect(result.applicability_score).toBeGreaterThanOrEqual(0.78);

    expect(ai_engine_stub.findSimilarPatterns).toHaveBeenCalledWith(
      new_deal_input
    );
    expect(ai_engine_stub.evaluatePatternRelevance).toHaveBeenCalledWith(
      similar_patterns_result[0],
      new_deal_input
    );
  });
});