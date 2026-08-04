import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出機能', () => {
  // SCEN-635
  test('過去成功商談が0件のとき、抽出可能なパターンがないエラーを返す', () => {
    const newDealCondition = {
      industry: 'IT',
      budget: 5000000,
      decisionMakerCount: 3,
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const result = extractSuccessPatterns(
      newDealCondition,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      success: false,
      errorCode: 'NO_PATTERNS_AVAILABLE',
      errorMessage:
        '抽出可能な成功パターンがありません。過去の成功商談が0件のため、推奨の生成ができません',
      statusCode: 400,
      recommendation: undefined,
      patterns: undefined,
    });
  });
});