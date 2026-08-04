import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-232
  test('推奨根拠テーブルが null のとき、可視化処理がエラーになる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        customerId: 'cust-123',
        dealConditions: {
          industry: 'IT',
          companySize: 'medium',
          budget: 1000000,
        },
        proposedApproach: 'Digital transformation consulting',
        reasoningTable: null,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newCaseData = {
      customerId: 'cust-123',
      customerName: 'Acme Corporation',
      industry: 'IT',
      companySize: 'medium',
      budget: 1000000,
      currentChallenge: 'Legacy system modernization',
      contactDate: new Date('2024-01-15T11:00:00Z'),
    };

    expect(() => {
      visualizeRecommendationReasoning(newCaseData, mockAIRecommendationEngine);
    }).toThrow(/推奨根拠テーブル/);
  });
});