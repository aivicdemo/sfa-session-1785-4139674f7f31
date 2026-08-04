import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 営業担当者権限がない利用者による推論実行指示が拒否される', () => {
  // SCEN-100
  test('営業担当者権限がない利用者が推論実行を試みた場合、HTTP 403が返却され、AIエージェント呼び出しが発生しない', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const userWithoutSalesAuthority = {
      userId: 'user-001',
      role: 'admin',
      salesAuthority: false,
    };

    const dealCondition = {
      customerId: 'cust-12345',
      customerIndustry: 'IT',
      customerSize: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
    };

    const result = () =>
      generateRecommendation(userWithoutSalesAuthority, dealCondition, mockAIEngine);

    expect(result).toThrow(/権限/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});