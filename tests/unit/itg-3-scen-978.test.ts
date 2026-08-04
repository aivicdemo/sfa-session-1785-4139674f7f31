import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-978
  test('過去商談データが null のとき、抽出処理が開始されず警告が返される', () => {
    const mockFindSimilarPatterns = jest.fn();

    const mockAIRecommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = extractSuccessPatterns(
      null,
      {
        customerId: 'CUST001',
        industry: 'IT',
        companySize: 'large',
      },
      mockAIRecommendationEngine
    );

    expect(mockFindSimilarPatterns).toHaveBeenCalledTimes(0);
    expect(result).toEqual({
      errorCode: 'NULL_HISTORICAL_DATA',
      errorMessage: '過去商談データが利用できません。抽出処理をスキップします。',
      statusCode: 400,
      patterns: [],
    });
  });
});