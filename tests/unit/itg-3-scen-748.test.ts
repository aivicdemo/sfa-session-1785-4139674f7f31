import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-748
  test('業種が null のとき、推奨生成不可と判定される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerData = {
      customerId: 'C12345',
      customerName: '株式会社テスト販売',
      industry: null,
      scale: '従業員1000名以上',
      dealId: 'DEAL-20240115-001',
    };

    const result = validateCustomerDataCompleteness(customerData, mockAIEngine);

    expect(result.isRecommendationGeneratable).toBe(false);
    expect(result.validationError).toMatch(/業種フィールドが空/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});