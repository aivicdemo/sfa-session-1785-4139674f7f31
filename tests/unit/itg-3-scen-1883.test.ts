import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1883
  test('顧客制約条件が空のとき照合に失敗する', () => {
    const dealId = 'DEAL-2024-001';
    const customerId = 'CUST-12345';
    const productCategory = 'enterprise-software';
    const dealAmount = 500000;
    const customerConstraints = {};

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      findSimilarPatterns(
        dealId,
        customerId,
        productCategory,
        dealAmount,
        customerConstraints,
        aiRecommendationEngineStub
      )
    ).toThrow(/制約条件/);

    expect(aiRecommendationEngineStub.generateRecommendation).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.findSimilarPatterns).not.toHaveBeenCalled();
  });
});