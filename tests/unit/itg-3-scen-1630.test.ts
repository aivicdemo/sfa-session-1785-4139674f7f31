import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1630
  test('[normal] 推奨妥当性スコア算出機能 - スコアが0の場合、営業管理職の承認判断対象として正しく記録される', async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const newDealInput = {
      customer_id: 'CUST_20240115_001',
      customer_name: 'Test Corporation',
      industry: 'IT',
      company_size: 'LARGE',
      contact_person: 'Tanaka Yamada',
      deal_name: 'Cloud Migration Project',
      deal_value: 5000000,
      deal_status: 'INITIAL',
      deal_conditions: {
        budget_limit: 5000000,
        decision_timeline_days: 90,
        required_features: ['scalability', 'security'],
        competitor_presence: true,
      },
    };

    const result = await evaluateRecommendationRelevance(
      newDealInput,
      mockAIEngine
    );

    expect(result.recommendation_score).toBe(0);
    expect(result.approval_status).toBe('PENDING');
    expect(result.approval_role).toBe('SALES_MANAGER');
    expect(result.target_flag).toBe(true);
    expect(result.recommendation_id).toBeDefined();
    expect(typeof result.recommendation_id).toBe('string');
    expect(result.created_at).toBeDefined();
    expect(result.recommendation_content).toEqual(
      expect.objectContaining({
        customer_id: 'CUST_20240115_001',
        deal_name: 'Cloud Migration Project',
      })
    );
  });
});