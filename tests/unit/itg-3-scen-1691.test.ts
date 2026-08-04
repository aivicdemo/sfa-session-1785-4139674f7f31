import { extractAndMatchSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1691
  test('新規案件の商談条件が空オブジェクトのとき、エラーが発生する', () => {
    const newDealData = {
      customerId: 'CUST-001',
      dealName: 'テスト案件',
      dealConditions: {}
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    expect(() => {
      extractAndMatchSuccessPatterns(newDealData, aiRecommendationEngineStub);
    }).toThrow(/商談条件が空/);
  });
});