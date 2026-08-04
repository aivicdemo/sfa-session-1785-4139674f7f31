import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1645
  test('推奨スコア算出機能 - 顧客の購買履歴データが null のとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      purchaseHistory: null,
      currentProposal: {
        proposalId: 'PROP-001',
        customerId: 'CUST-001',
        proposedItems: [
          {
            itemId: 'ITEM-001',
            quantity: 10,
            unitPrice: 1000,
          },
        ],
        proposedTiming: new Date('2024-02-15T09:00:00Z'),
      },
      aiEngine: mockAIEngine,
    };

    expect(() => calculateRecommendationScore(input)).toThrow(/購買履歴データ/);
  });
});