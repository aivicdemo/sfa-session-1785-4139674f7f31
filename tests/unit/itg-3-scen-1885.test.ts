import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1885
  test('提案内容が空のとき照合に失敗する', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalContent: '',
        confidenceScore: 0,
        reasoning: '',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const testCustomerData = {
      customerName: 'テスト顧客A',
      industry: '製造業',
      budget: 5000000,
    };

    const testDealCondition = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      stage: 'initial_proposal',
      targetAmount: 5000000,
    };

    let thrownError: Error | null = null;
    try {
      await generateRecommendation(testCustomerData, testDealCondition, mockAIEngine);
    } catch (error) {
      thrownError = error as Error;
    }

    expect(thrownError).not.toBeNull();
    expect(thrownError?.message).toMatch(/提案内容が空/);
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
  });
});