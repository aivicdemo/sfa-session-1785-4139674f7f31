import { evaluateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-750: 商談条件が null のとき、推奨生成不可と判定される', () => {
    // Arrange
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerData = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: 'IT',
      scale: 'large',
      representativeContactName: '営業太郎',
    };

    const dealCondition = null;

    // Act
    const result = evaluateCustomerDataCompleteness(
      customerData,
      dealCondition,
      mockAIEngine
    );

    // Assert
    expect(result.canGenerateRecommendation).toBe(false);
    expect(result.errorCode).toBe('DEAL_CONDITION_NULL');
    expect(result.recommendations).toEqual([]);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
  });
});