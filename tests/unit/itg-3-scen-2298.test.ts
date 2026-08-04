import { detectAnomalousPatterns } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2298
  test('顧客対応記録が0件のとき異常パターンが検出されない', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const dealCondition = {
      industry: 'IT',
      budget: 5000000,
      decisionMaker: 'CTO',
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
    };

    const emptyCustomerInteractionRecords: any[] = [];

    const result = detectAnomalousPatterns(
      dealCondition,
      emptyCustomerInteractionRecords,
      mockAIEngine,
      mockLogger
    );

    expect(result.detectedPatterns).toEqual([]);
    expect(result.warningFlagActive).toBe(false);
    expect(result.errorMessage).toBeNull();
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringMatching(/顧客対応記録が0件のため比較不可/)
    );
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
  });
});