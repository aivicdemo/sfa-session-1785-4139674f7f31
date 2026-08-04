import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2612
  test('[normal] 推奨根拠の可視化機能 - 同じ推奨パターンについて2回根拠説明を生成した場合、同一の説明文が返却される', async () => {
    const mock_engine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '本案件は過去成功事例に基づき、段階的導入アプローチを推奨します。理由：同一業種での成功率87%、導入期間実績6.2ヶ月、ROI回収期間平均14ヶ月'
      ),
    };

    const new_case_alpha = {
      customer_industry: '製造業',
      customer_size: 'large',
      budget_amount: 50000000,
      planned_implementation_period_months: 6,
    };

    const recommendation_pattern_alpha = {
      pattern_id: 'pat-001',
      industry: '製造業',
      min_budget: 50000000,
      max_budget: 100000000,
      implementation_period_months: 6,
      success_rate: 87,
      avg_roi_recovery_months: 14,
    };

    const root_reason_text_1 = await explainRecommendationReasoning(
      new_case_alpha,
      recommendation_pattern_alpha,
      mock_engine
    );

    const root_reason_text_2 = await explainRecommendationReasoning(
      new_case_alpha,
      recommendation_pattern_alpha,
      mock_engine
    );

    const expected_explanation =
      '本案件は過去成功事例に基づき、段階的導入アプローチを推奨します。理由：同一業種での成功率87%、導入期間実績6.2ヶ月、ROI回収期間平均14ヶ月';

    expect(root_reason_text_1).toBe(expected_explanation);
    expect(root_reason_text_2).toBe(expected_explanation);
    expect(root_reason_text_1).toEqual(root_reason_text_2);
    expect(mock_engine.explainRecommendationReasoning).toHaveBeenCalledTimes(2);
  });
});