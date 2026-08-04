import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度検証機能 - 成功パターン抽出', () => {
  test('SCEN-356: 成功パターン抽出データが0件のとき、精度検証がエラーになる', () => {
    // Arrange
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const testNewDealData = {
      customerId: 'CUST-20240115-001',
      industryType: 'Manufacturing',
      companyScale: 500,
      dealAmount: 5000000,
      dealStage: 'Proposal',
      dealConditions: {
        budgetConstraint: 5000000,
        timelineConstraint: '2024-03-31',
        decisionMaker: 'CTO',
      },
    };

    // Act & Assert
    expect(() =>
      evaluateRecommendationAccuracy(testNewDealData, mockAIEngine)
    ).toThrow(/PATTERN_DATA_EMPTY|成功パターンデータが0件/);
  });
});