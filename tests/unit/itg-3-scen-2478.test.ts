import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチの自動推奨機能', () => {
  // SCEN-2478
  test('同じ新規案件で2回推奨を実行した場合、同じ提案アプローチが推奨される', async () => {
    // テスト用の新規案件データ準備
    const test_deal = {
      customer_name: 'TestCorp',
      industry: 'IT',
      budget_jpy: 5000000,
      challenge: '業務効率化',
    };

    // AIRecommendationEngineのスタブ定義
    const stub_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposed_approach: 'クラウド導入型ソリューション',
        confidence_score: 0.87,
        reasoning_id: 'PAT-2024-001',
        details: {
          implementation_timeline_months: 3,
          expected_roi_percent: 35,
          risk_factors: ['データ移行'],
        },
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    // 1回目の推奨実行
    const first_result = await generateRecommendation(
      test_deal,
      stub_ai_engine
    );

    const first_recommendation = {
      proposed_approach: first_result.proposed_approach,
      confidence_score: first_result.confidence_score,
      reasoning_id: first_result.reasoning_id,
      implementation_timeline_months: first_result.details.implementation_timeline_months,
      expected_roi_percent: first_result.details.expected_roi_percent,
      risk_factors: first_result.details.risk_factors,
    };

    // スタブをリセット（同じ応答を返すように再設定）
    stub_ai_engine.generateRecommendation.mockClear();
    stub_ai_engine.generateRecommendation.mockResolvedValue({
      proposed_approach: 'クラウド導入型ソリューション',
      confidence_score: 0.87,
      reasoning_id: 'PAT-2024-001',
      details: {
        implementation_timeline_months: 3,
        expected_roi_percent: 35,
        risk_factors: ['データ移行'],
      },
    });

    // 2回目の推奨実行
    const second_result = await generateRecommendation(
      test_deal,
      stub_ai_engine
    );

    const second_recommendation = {
      proposed_approach: second_result.proposed_approach,
      confidence_score: second_result.confidence_score,
      reasoning_id: second_result.reasoning_id,
      implementation_timeline_months: second_result.details.implementation_timeline_months,
      expected_roi_percent: second_result.details.expected_roi_percent,
      risk_factors: second_result.details.risk_factors,
    };

    // 1回目と2回目の推奨結果を比較検証
    expect(second_recommendation.proposed_approach).toBe(
      'クラウド導入型ソリューション'
    );
    expect(second_recommendation.confidence_score).toBe(0.87);
    expect(second_recommendation.reasoning_id).toBe('PAT-2024-001');
    expect(second_recommendation.implementation_timeline_months).toBe(3);
    expect(second_recommendation.expected_roi_percent).toBe(35);
    expect(second_recommendation.risk_factors).toEqual(['データ移行']);

    // 1回目と2回目が完全に一致することを検証
    expect(second_recommendation).toEqual(first_recommendation);
  });
});