import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-216
  test('新規案件の顧客ID が空文字列のとき、推奨処理がエラーになる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const invalidInput = {
      customerId: '',
      dealConditions: {
        industryType: '製造業',
        companySize: 'large',
        budget: 5000000,
        decisionTimeline: 60,
      },
      historicalDataReference: {
        successCaseCount: 15,
        similarPatternCount: 3,
      },
    };

    expect(() =>
      generateRecommendation(invalidInput, mockAIRecommendationEngine)
    ).toThrow(/顧客ID/);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});