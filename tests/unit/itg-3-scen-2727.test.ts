import { extractSuccessPatternsAndRecommend } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・推奨ロジック', () => {
  // SCEN-2727
  test('新規案件の顧客IDが欠落しているとき処理が失敗する', () => {
    const newDealData = {
      dealName: '新規案件A',
      dealAmount: 500000,
      industryType: 'IT',
      customerId: null,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => extractSuccessPatternsAndRecommend(newDealData, mockAIEngine)).toThrow(/顧客ID/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});