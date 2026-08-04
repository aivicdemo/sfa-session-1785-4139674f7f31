import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - データ完全性判定', () => {
  test('SCEN-730: 企業規模がゼロのとき推奨生成不可と判定される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealData = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト営業',
      industry: 'IT',
      companySize: 0,
      dealAmount: 5000000,
      dealStatus: 'initial_contact',
      aiEngine: mockAIEngine,
    };

    expect(() => {
      validateCustomerDataCompleteness(dealData);
    }).toThrow(/企業規模/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
  });
});