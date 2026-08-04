import { generateRecommendationApproach } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨生成機能', () => {
  test('SCEN-952: 顧客IDが未設定のとき、推奨生成処理が開始されず警告が返される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputWithoutCustomerId = {
      customerId: null,
      dealDescription: 'B2B SaaS solution for enterprise',
      industry: 'Finance',
      companySize: 'large',
      budget: 500000,
    };

    const result = generateRecommendationApproach(
      inputWithoutCustomerId,
      mockAIEngine
    );

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(result.errorCode).toBe('CUSTOMER_ID_NOT_SET');
    expect(result.message).toBe(
      '顧客IDが設定されていません。推奨を生成するには顧客IDが必須です'
    );
    expect(result.success).toBe(false);
  });
});