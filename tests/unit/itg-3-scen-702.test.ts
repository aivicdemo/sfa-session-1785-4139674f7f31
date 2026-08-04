import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('顧客データ完全性・妥当性判定機能', () => {
  test('SCEN-702: 商談予定日が空のとき、推奨生成不可と判定される', () => {
    // Arrange
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerData = {
      customerId: 'CUST-001',
      customerName: '株式会社サンプル',
      industry: '製造業',
    };

    const dealData = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      scheduledDate: null,
      dealAmount: 5000000,
      stage: '初期接触',
    };

    // Act
    const result = validateCustomerDataCompleteness(
      customerData,
      dealData,
      mockAIEngine
    );

    // Assert
    expect(result.canGenerateRecommendation).toBe(false);
    expect(result.validationMessage).toMatch(/商談予定日/);
    expect(result.validationMessage).toMatch(/未入力/);
    expect(result.validationMessage).toMatch(/時系列情報/);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(0);
  });
});