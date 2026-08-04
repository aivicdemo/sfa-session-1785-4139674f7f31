import { validateRecommendationGenerationReadiness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-728: [error] 推奨生成前データ完全性判定機能 - 営業担当者に必要な権限がないとき推奨生成不可と判定される', () => {
    const sales_user_id = 'sales_user_001';
    const user_authority = {
      user_id: sales_user_id,
      has_recommendation_generation_permission: false,
      roles: ['sales_representative'],
    };

    const customer_info = {
      customer_id: 'cust_12345',
      customer_name: 'Test Corporation',
      industry: 'Manufacturing',
      company_size: 'large',
      contact_email: 'contact@testcorp.example.com',
    };

    const deal_info = {
      deal_id: 'deal_67890',
      deal_stage: 'negotiation',
      estimated_amount: 500000,
    };

    const request_payload = {
      user_id: sales_user_id,
      user_authority: user_authority,
      customer_info: customer_info,
      deal_info: deal_info,
    };

    const mock_ai_engine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = validateRecommendationGenerationReadiness(request_payload, mock_ai_engine);

    expect(result.status).toBe('PERMISSION_DENIED');
    expect(result.httpStatusCode).toBe(403);
    expect(result.errorCode).toBe('INSUFFICIENT_AUTHORITY');
    expect(result.error_message).toMatch(/権限/);
    expect(mock_ai_engine.generateRecommendation).not.toHaveBeenCalled();
  });
});