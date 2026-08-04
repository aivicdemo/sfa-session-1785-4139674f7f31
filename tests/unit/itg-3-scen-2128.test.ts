import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への適用推奨', () => {
  // SCEN-2128
  test('過去商談データが空配列のとき、エラーが発生する', () => {
    const emptyHistoricalData: Array<{
      customerId: string;
      customerName: string;
      industry: string;
      dealAmount: number;
      proposalApproach: string;
      outcome: 'won' | 'lost';
    }> = [];

    const newDealData = {
      customerId: 'CUST-2024-001',
      customerName: 'New Customer Corp',
      industry: 'Manufacturing',
      estimatedDealAmount: 500000,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => {
      generateRecommendation(newDealData, emptyHistoricalData, mockAIEngine);
    }).toThrow(/過去商談データが空/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});