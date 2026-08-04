import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1213
  test('営業プロセス条件が空配列のとき、エラーを返す', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const proposalInput = {
      customerId: 'CUST-001',
      productName: 'Product A',
      proposedPrice: 100000,
      proposedQuantity: 10,
    };

    const emptySalesProcessConditions: Array<{
      conditionId: string;
      conditionName: string;
      expectedValue: string | number;
    }> = [];

    const customerConstraints = {
      customerId: 'CUST-001',
      budgetLimit: 150000,
      purchaseFrequency: 'monthly',
      allowedProductCategories: ['Product A', 'Product B'],
    };

    const result = evaluateProposalValidity(
      proposalInput,
      emptySalesProcessConditions,
      customerConstraints,
      mockAIEngine,
      mockFileStorage
    );

    expect(result).toEqual({
      success: false,
      errorCode: 'EMPTY_SALES_PROCESS_CONDITIONS',
      errorMessage: '営業プロセス条件が1件以上必要です',
      httpStatusCode: 400,
    });

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
    expect(mockFileStorage.generateDownloadUrl).not.toHaveBeenCalled();
  });
});