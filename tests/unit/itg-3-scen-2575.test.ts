import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2575
  test('推奨内容の根拠表示機能 - 根拠の有効期限が月初のとき、表示状態が判定される', () => {
    const currentDateAtMonthStart = new Date('2026-02-01T00:00:00Z');
    const currentDateAfterMonthStart = new Date('2026-02-02T00:00:00Z');
    const reasonValidityExpiryAtMonthStart = new Date('2026-02-01T00:00:00Z');

    const dealConditions = {
      customer_name: 'テスト顧客A',
      industry: '金融',
      company_size: 'large',
      budget_scale: 10000000,
      product_category: 'クラウドソリューション',
      deal_stage: 'negotiation'
    };

    const stubAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendation_id: 'rec-001',
        recommendation_content: '提案内容：クラウドソリューション導入で業務効率化を実現',
        confidence_score: 85,
        reasoning_details: {
          reason_id: 'reason-001',
          reason_basis: '過去の類似案件では、金融業界の大規模顧客向けクラウドソリューション提案の成功率が92%',
          historical_pattern: 'similar_successful_case_001',
          validity_expiry: reasonValidityExpiryAtMonthStart.toISOString()
        },
        generated_at: currentDateAtMonthStart.toISOString()
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn().mockReturnValue(''),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0)
    };

    const resultAtMonthStart = generateRecommendationWithReasoning(
      dealConditions,
      stubAIEngine,
      currentDateAtMonthStart
    );

    expect(resultAtMonthStart).toBeDefined();
    expect(resultAtMonthStart.recommendation_id).toBe('rec-001');
    expect(resultAtMonthStart.reasoning_details).toBeDefined();
    expect(resultAtMonthStart.reasoning_details.validity_expiry).toBe(
      reasonValidityExpiryAtMonthStart.toISOString()
    );
    expect(resultAtMonthStart.reasoning_display_state).toBe('valid');

    const resultAfterMonthStart = generateRecommendationWithReasoning(
      dealConditions,
      stubAIEngine,
      currentDateAfterMonthStart
    );

    expect(resultAfterMonthStart).toBeDefined();
    expect(resultAfterMonthStart.recommendation_id).toBe('rec-001');
    expect(resultAfterMonthStart.reasoning_details.validity_expiry).toBe(
      reasonValidityExpiryAtMonthStart.toISOString()
    );
    expect(resultAfterMonthStart.reasoning_display_state).toBe('expired');
  });
});