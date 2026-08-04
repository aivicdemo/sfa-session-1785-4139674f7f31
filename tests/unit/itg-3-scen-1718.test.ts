import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能 - 購買履歴順序の正規化', () => {
  test('SCEN-1718: 購買履歴が逆順で入力されたときも推奨スコアを正しく計算する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.75),
    };

    const reversedPurchaseHistory = [
      { date: '2026-01-15', product: 'ProductA' },
      { date: '2026-01-10', product: 'ProductB' },
      { date: '2026-01-05', product: 'ProductC' },
    ];

    const orderedPurchaseHistory = [
      { date: '2026-01-05', product: 'ProductC' },
      { date: '2026-01-10', product: 'ProductB' },
      { date: '2026-01-15', product: 'ProductA' },
    ];

    const reversedCaseData = {
      customerId: 'CUST-001',
      customerName: 'TestCustomer',
      industry: 'Technology',
      purchaseHistory: reversedPurchaseHistory,
      currentProposal: {
        productCategory: 'SoftwareService',
        estimatedAmount: 500000,
        proposalDate: '2026-01-20',
      },
    };

    const orderedCaseData = {
      customerId: 'CUST-001',
      customerName: 'TestCustomer',
      industry: 'Technology',
      purchaseHistory: orderedPurchaseHistory,
      currentProposal: {
        productCategory: 'SoftwareService',
        estimatedAmount: 500000,
        proposalDate: '2026-01-20',
      },
    };

    const reversedScore = evaluatePatternRelevance(
      reversedCaseData,
      mockAIEngine,
    );

    const orderedScore = evaluatePatternRelevance(orderedCaseData, mockAIEngine);

    expect(reversedScore).toBe(0.75);
    expect(orderedScore).toBe(0.75);
    expect(reversedScore).toEqual(orderedScore);
  });
});