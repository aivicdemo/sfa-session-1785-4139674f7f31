import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への適用推奨', () => {
  // SCEN-2126
  test('新規案件の顧客・商談条件が空オブジェクトのとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const emptyCustomerCondition = {};
    const emptyDealCondition = {};

    expect(() => {
      generateRecommendation(
        emptyCustomerCondition,
        emptyDealCondition,
        mockAIEngine
      );
    }).toThrow(/顧客条件が不足しています/);

    expect(() => {
      generateRecommendation(
        emptyCustomerCondition,
        emptyDealCondition,
        mockAIEngine
      );
    }).toThrow(/商談条件が不足しています/);
  });
});