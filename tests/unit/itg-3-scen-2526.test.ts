import { extractAndStructureSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2526
  test('失敗要因リストが欠落しているとき、例外が発生する', () => {
    const successPatternData = {
      caseId: 'CASE001',
      customerId: 'CUST001',
      customerIndustry: 'Manufacturing',
      customerSize: 'Large',
      productCategory: 'Enterprise Software',
      dealAmount: 500000,
      dealStatus: 'Closed Won',
      successFactors: ['Budget alignment', 'Technical fit', 'Executive sponsor'],
      failureReasonsList: null,
      aiRecommendationEngineStub: {
        generateRecommendation: jest.fn().mockResolvedValue({
          approach: 'Executive engagement',
          confidence: 0.92,
        }),
        findSimilarPatterns: jest.fn().mockResolvedValue([]),
        explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
        evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
      },
    };

    expect(() => {
      extractAndStructureSuccessPatterns(successPatternData);
    }).toThrow(/失敗要因リスト/);
  });
});