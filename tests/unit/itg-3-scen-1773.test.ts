import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1773
  test('推奨根拠が1件のとき根拠表示内容に1要素を含めて返す', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoning_text: '顧客業界での成功事例',
        reasoning_items: [
          {
            reason_type: 'success_case_match',
            reason_description: '顧客業界での成功事例'
          }
        ]
      }),
      evaluatePatternRelevance: jest.fn()
    };

    const recommendationId = 'rec-001';
    const dealConditions = {
      customer_industry: 'manufacturing',
      customer_scale: 'large',
      product_category: 'enterprise_software',
      deal_stage: 'proposal',
      customer_id: 'cust-12345'
    };

    const result = explainRecommendationReasoning(
      recommendationId,
      dealConditions,
      mockAIRecommendationEngine
    );

    expect(result).toBeDefined();
    expect(result.reasoning_items).toHaveLength(1);
    expect(result.reasoning_items[0].reason_description).toBe('顧客業界での成功事例');
    expect(result.reasoning_text).toBe('顧客業界での成功事例');
  });
});