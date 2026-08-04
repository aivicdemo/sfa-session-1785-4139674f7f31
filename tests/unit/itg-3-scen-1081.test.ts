import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1081
  test('新規案件の顧客IDが null のとき、推奨生成処理がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealWithNullCustomerId = {
      customerId: null,
      dealName: 'Test Deal',
      dealAmount: 100000,
      dealStage: 'initial_contact',
      productCategory: 'software',
      dealSize: 'medium',
      customerIndustry: 'finance',
      customerScale: 'enterprise',
    };

    expect(() => {
      generateRecommendation(newDealWithNullCustomerId, mockAIEngine);
    }).toThrow(/顧客ID/);
  });
});