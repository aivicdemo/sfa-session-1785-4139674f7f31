import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-747
  test('顧客データ完全性・妥当性判定機能 - 顧客名が null のとき、推奨生成不可と判定される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerData = {
      customerId: 'CUST-001',
      customerName: null,
      industry: '製造業',
      scale: 'large',
      dealCondition: {
        dealId: 'DEAL-001',
        stage: 'initial_contact',
        budget: 1000000,
        timeline: '2026-Q2',
      },
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = validateCustomerDataCompleteness(
      customerData,
      mockAIRecommendationEngine,
    );

    expect(result).toEqual({
      isValid: false,
      canGenerateRecommendation: false,
      reason: '顧客名が必須項目です',
    });

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('顧客名'),
    );

    consoleSpy.mockRestore();
  });
});