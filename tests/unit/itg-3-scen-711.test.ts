import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('顧客データ完全性・妥当性判定機能', () => {
  // SCEN-711
  test('[normal] 過去に同一顧客との商談記録が複数件のとき、推奨生成に必要なデータセットは妥当と判定される', () => {
    const pastNegotiationRecords = [
      {
        negotiation_id: 'NEG-001',
        customer_id: 'CUST-001',
        negotiation_date: '2024-01-15',
        product_category: 'Software',
        amount: 150000,
        success_flag: true,
        hearing_content: 'Customer needs process automation',
      },
      {
        negotiation_id: 'NEG-002',
        customer_id: 'CUST-001',
        negotiation_date: '2024-02-20',
        product_category: 'Consulting',
        amount: 250000,
        success_flag: true,
        hearing_content: 'Customer needs business transformation',
      },
      {
        negotiation_id: 'NEG-003',
        customer_id: 'CUST-001',
        negotiation_date: '2024-03-10',
        product_category: 'Support',
        amount: 80000,
        success_flag: false,
        hearing_content: 'Customer needs ongoing support services',
      },
    ];

    const newNegotiationInput = {
      customer_id: 'CUST-001',
      customer_name: 'Acme Corporation',
      industry: 'Manufacturing',
      challenge: 'Supply chain optimization',
      budget_range: '300000-500000',
      decision_maker: 'CTO',
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        { negotiation_id: 'NEG-001', match_score: 0.85 },
        { negotiation_id: 'NEG-002', match_score: 0.72 },
        { negotiation_id: 'NEG-003', match_score: 0.68 },
      ]),
    };

    const result = validateCustomerDataCompleteness(
      pastNegotiationRecords,
      newNegotiationInput,
      mockAIRecommendationEngine
    );

    expect(result.is_valid).toBe(true);
    expect(result.judgment_reason).toMatch(/過去商談記録3件/);
    expect(result.judgment_reason).toMatch(/必須フィールド/);
    expect(result.judgment_reason).toMatch(/推奨生成に必要なデータセット/);
    expect(result.valid_data_count).toBe(3);
    expect(result.usable_score_range.min).toBe(0.68);
    expect(result.usable_score_range.max).toBe(0.85);
    expect(result.is_ready_for_recommendation).toBe(true);
  });
});