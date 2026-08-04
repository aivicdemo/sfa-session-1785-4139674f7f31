import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨ロジック', () => {
  // SCEN-2729
  test('過去成功パターンデータセットが空のとき処理が失敗する', () => {
    const aiEngineStub = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newCaseInput = {
      customerId: 'test-cust-001',
      productCategory: 'Enterprise',
      budgetAmount: 50000000,
    };

    expect(() => generateRecommendation(newCaseInput, aiEngineStub)).toThrow(
      /NO_HISTORICAL_PATTERNS/,
    );
  });
});