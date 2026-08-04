import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能', () => {
  test('SCEN-276: 推奨対象となる過去成功事例が1件のとき、そのアプローチが唯一の推奨内容になる', async () => {
    // モック化されたAIRecommendationEngine
    const mock_ai_recommendation_engine = {
      findSimilarPatterns: jest.fn(async () => [
        {
          customer_industry: '製造業',
          deal_range_min: 5000000,
          deal_range_max: 10000000,
          proposed_approach: 'DX導入支援',
          relevance_score: 0.95,
        },
      ]),
      generateRecommendation: jest.fn(async (customer_industry: string, deal_amount: number, current_issue: string, similar_patterns: any[]) => {
        return {
          recommended_approaches: [
            {
              approach_name: 'DX導入支援',
              confidence_score: 0.95,
              reason: '過去の成功事例（顧客業種：製造業、商談規模：500万円～1000万円）との関連度が0.95と高く、現在の案件条件と一致する唯一の成功パターンであるため',
            },
          ],
        };
      }),
      explainRecommendationReasoning: jest.fn(async () => ({
        reasoning: '過去の成功事例（顧客業種：製造業、商談規模：500万円～1000万円）との関連度が0.95と高く、現在の案件条件と一致する唯一の成功パターンであるため',
      })),
      evaluatePatternRelevance: jest.fn(async () => ({ score: 0.95 })),
    };

    // 新規案件の入力値
    const new_deal_input = {
      customer_industry: '製造業',
      deal_amount: 6000000,
      current_business_issue: '製造プロセスの効率化相談',
    };

    // generateRecommendationメソッドを呼び出し
    const recommendation_result = await generateRecommendation(
      new_deal_input.customer_industry,
      new_deal_input.deal_amount,
      new_deal_input.current_business_issue,
      mock_ai_recommendation_engine
    );

    // 推奨アプローチが『DX導入支援』のみ1件である
    expect(recommendation_result.recommended_approaches).toHaveLength(1);

    // 推奨アプローチの内容を検証
    expect(recommendation_result.recommended_approaches[0]).toEqual({
      approach_name: 'DX導入支援',
      confidence_score: 0.95,
      reason: '過去の成功事例（顧客業種：製造業、商談規模：500万円～1000万円）との関連度が0.95と高く、現在の案件条件と一致する唯一の成功パターンであるため',
    });

    // 推奨結果に含まれる根拠を検証
    expect(recommendation_result.recommended_approaches[0].reason).toMatch(/過去の成功事例/);
    expect(recommendation_result.recommended_approaches[0].reason).toMatch(/製造業/);
    expect(recommendation_result.recommended_approaches[0].reason).toMatch(/0.95/);
  });
});