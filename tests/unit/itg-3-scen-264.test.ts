import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・マッチング機能', () => {
  // SCEN-264
  test('新規案件の顧客条件が入力されていないとき、推奨生成がスキップされる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealWithoutCustomerConditions = {
      customerId: 'CUST-12345',
      dealId: 'DEAL-67890',
      dealName: '新規提案案件',
      customerIndustry: null,
      customerScale: null,
      customerChallenge: null,
      productCategory: 'SOFTWARE',
      proposalAmount: 500000,
      targetCloseDate: '2026-12-31',
    };

    const result = generateRecommendation(
      newDealWithoutCustomerConditions,
      mockAIEngine
    );

    expect(result).toEqual({
      status: 'SKIPPED',
      reason: 'MISSING_CUSTOMER_CONDITIONS',
      recommendation: null,
      message: '顧客条件が入力されていないため、推奨生成がスキップされました',
    });

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(0);
  });
});