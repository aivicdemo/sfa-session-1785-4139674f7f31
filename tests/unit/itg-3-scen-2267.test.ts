import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2267
  test('新規案件の商談条件が空のときエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealWithEmptyConditions = {
      dealId: 'deal-001',
      customerId: 'cust-001',
      dealConditions: {} as Record<string, any>,
    };

    expect(() =>
      findSimilarPatterns(newDealWithEmptyConditions, mockAIEngine)
    ).toThrow(/商談条件/);
  });
});